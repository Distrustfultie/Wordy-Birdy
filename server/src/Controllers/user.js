import mongoose from "mongoose";
import User from "../Models/User.js";
import FriendRequest from "../Models/FriendRequest.js";
import { PUBLIC_USER_FIELDS, buildProfileUpdate, syncStreamUser } from "../lib/profile.js";

const CARD_FIELDS = "fullName profilePic nativeLanguage learningLanguage location bio";

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const invalidId = (res) => res.status(400).json({ message: "Invalid id" });

/**
 * Recommended language partners: onboarded users who are not you or your friends.
 * Optional query params:
 *   - search:   matches name or location (case-insensitive)
 *   - language: only users whose native language is this one
 * Users who natively speak the language you're learning are listed first.
 */
export async function getRecommendedUsers(req, res) {
  try {
    const currentUser = req.user;
    const { search = "", language = "" } = req.query;

    const filter = {
      _id: { $ne: currentUser._id, $nin: currentUser.friends },
      isOnboarded: true,
    };

    if (typeof search === "string" && search.trim()) {
      const rx = new RegExp(escapeRegex(search.trim().slice(0, 60)), "i");
      filter.$or = [{ fullName: rx }, { location: rx }];
    }

    if (typeof language === "string" && language.trim()) {
      filter.nativeLanguage = new RegExp(`^${escapeRegex(language.trim())}$`, "i");
    }

    const users = await User.find(filter)
      .select(PUBLIC_USER_FIELDS)
      .sort({ createdAt: -1 })
      .limit(60)
      .lean();

    const learning = currentUser.learningLanguage?.toLowerCase();
    const isMatch = (u) => !!learning && u.nativeLanguage?.toLowerCase() === learning;

    const ranked = users
      .map((u) => ({ ...u, isMatch: isMatch(u) }))
      .sort((a, b) => Number(b.isMatch) - Number(a.isMatch));

    res.status(200).json(ranked);
  } catch (error) {
    console.error("Error in getRecommendedUsers controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/** The authenticated user's friends. */
export async function getMyFriends(req, res) {
  try {
    const user = await User.findById(req.user._id)
      .select("friends")
      .populate("friends", CARD_FIELDS);

    res.status(200).json(user.friends);
  } catch (error) {
    console.error("Error in getMyFriends controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * A user's public profile plus how they relate to the viewer:
 * "self" | "friends" | "request_sent" | "request_received" | "none".
 */
export async function getUserProfile(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return invalidId(res);

    const user = await User.findOne({ _id: id, isOnboarded: true })
      .select(`${PUBLIC_USER_FIELDS} friends`)
      .lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    const myId = req.user._id.toString();
    const theirFriends = user.friends.map(String);
    const myFriends = req.user.friends.map(String);

    let relationship = "none";
    let requestId = null;

    if (id === myId) {
      relationship = "self";
    } else if (myFriends.includes(id)) {
      relationship = "friends";
    } else {
      const pending = await FriendRequest.findOne({
        status: "pending",
        $or: [
          { sender: myId, recipient: id },
          { sender: id, recipient: myId },
        ],
      }).lean();

      if (pending) {
        requestId = pending._id;
        relationship = pending.sender.toString() === myId ? "request_sent" : "request_received";
      }
    }

    const mutualFriends = id === myId ? 0 : theirFriends.filter((f) => myFriends.includes(f)).length;

    const { friends, ...profile } = user;
    res.status(200).json({
      ...profile,
      friendsCount: friends.length,
      mutualFriends,
      relationship,
      requestId,
    });
  } catch (error) {
    console.error("Error in getUserProfile controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/** Updates the authenticated user's own profile. */
export async function updateMyProfile(req, res) {
  try {
    const { updates, error } = buildProfileUpdate(req.body);
    if (error) return res.status(400).json({ message: error });

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    await syncStreamUser(updatedUser);

    res.status(200).json({ success: true, user: updatedUser, message: "Profile updated" });
  } catch (error) {
    console.error("Error in updateMyProfile controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * Sends a friend request. Rejects requests to yourself, to existing friends,
 * and duplicates in either direction.
 */
export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user.id;
    const { id: recipientId } = req.params;
    if (!mongoose.isValidObjectId(recipientId)) return invalidId(res);

    if (myId === recipientId) {
      return res.status(400).json({ message: "You can't send friend request to yourself" });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    if (recipient.friends.some((f) => f.toString() === myId)) {
      return res.status(400).json({ message: "You are already friends with this user" });
    }

    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "A friend request already exists between you and this user" });
    }

    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });

    res.status(201).json(friendRequest);
  } catch (error) {
    console.error("Error in sendFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/** Accepts a pending request addressed to the authenticated user. */
export async function acceptFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;
    if (!mongoose.isValidObjectId(requestId)) return invalidId(res);

    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest || friendRequest.status !== "pending") {
      return res.status(404).json({ message: "Friend request not found" });
    }

    if (friendRequest.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to accept this request" });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    // $addToSet only adds if not already present.
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });
    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.log("Error in acceptFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * Removes a pending request: the recipient declines it, or the sender cancels it.
 */
export async function deleteFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;
    if (!mongoose.isValidObjectId(requestId)) return invalidId(res);

    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest || friendRequest.status !== "pending") {
      return res.status(404).json({ message: "Friend request not found" });
    }

    const myId = req.user.id;
    const isSender = friendRequest.sender.toString() === myId;
    const isRecipient = friendRequest.recipient.toString() === myId;
    if (!isSender && !isRecipient) {
      return res.status(403).json({ message: "You are not part of this request" });
    }

    await friendRequest.deleteOne();

    res.status(200).json({ message: isSender ? "Friend request cancelled" : "Friend request declined" });
  } catch (error) {
    console.log("Error in deleteFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * Unfriends a user on both sides and clears the old request between them,
 * so either of them can send a new one later.
 */
export async function removeFriend(req, res) {
  try {
    const { id: friendId } = req.params;
    if (!mongoose.isValidObjectId(friendId)) return invalidId(res);

    const myId = req.user._id;

    await User.findByIdAndUpdate(myId, { $pull: { friends: friendId } });
    await User.findByIdAndUpdate(friendId, { $pull: { friends: myId } });
    await FriendRequest.deleteMany({
      $or: [
        { sender: myId, recipient: friendId },
        { sender: friendId, recipient: myId },
      ],
    });

    res.status(200).json({ message: "Friend removed" });
  } catch (error) {
    console.log("Error in removeFriend controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * Incoming pending requests, plus requests you sent that were accepted (activity feed).
 */
export async function getFriendRequests(req, res) {
  try {
    const incomingReqs = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    })
      .sort({ createdAt: -1 })
      .populate("sender", CARD_FIELDS);

    const acceptedReqs = await FriendRequest.find({
      sender: req.user.id,
      status: "accepted",
    })
      .sort({ updatedAt: -1 })
      .limit(20)
      .populate("recipient", "fullName profilePic");

    // A user may have been deleted; drop requests whose other side no longer exists.
    res.status(200).json({
      incomingReqs: incomingReqs.filter((r) => r.sender),
      acceptedReqs: acceptedReqs.filter((r) => r.recipient),
    });
  } catch (error) {
    console.log("Error in getFriendRequests controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/** Pending requests the authenticated user has sent. */
export async function getOutgoingFriendReqs(req, res) {
  try {
    const outgoingRequests = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    })
      .sort({ createdAt: -1 })
      .populate("recipient", CARD_FIELDS);

    res.status(200).json(outgoingRequests.filter((r) => r.recipient));
  } catch (error) {
    console.log("Error in getOutgoingFriendReqs controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
