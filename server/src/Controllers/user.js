import User from "../Models/User.js";
import FriendRequest from "../Models/FriendRequest.js";

/**
 * Gets a list of recommended users that the authenticated user can send a friend request to.
 * The list is sorted by the language the user is learning, and the users are limited to those
 * who have completed the onboarding process.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object[] | null>} - The list of recommended users if the request is successful, null otherwise.
 */
export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user.id;
    const currentUser = req.user;

    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } }, //exclude current user
        { _id: { $nin: currentUser.friends } }, // exclude current user's friends
        { isOnboarded: true },
      ],
    });
    res.status(200).json(recommendedUsers);
  } catch (error) {
    console.error("Error in getRecommendedUsers controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * Gets the list of friends of the authenticated user.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object[] | null>} - The list of friends if the request is successful, null otherwise.
 */
export async function getMyFriends(req, res) {
  try {
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate("friends", "fullName profilePic nativeLanguage learningLanguage");

    res.status(200).json(user.friends);
  } catch (error) {
    console.error("Error in getMyFriends controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * Sends a friend request from the authenticated user to another user.
 * Ensures that the user cannot send a request to themselves, cannot send a request
 * to a user they are already friends with, and cannot send a duplicate request.
 * 
 * @param {Object} req - Express request object containing the authenticated user and recipient ID.
 * @param {Object} res - Express response object used to send back the appropriate response.
 * @returns {Promise<void>} - Sends a JSON response indicating the result of the friend request operation.
 */


/**
 * Sends a friend request from the authenticated user to another user.
 * Ensures that the user cannot send a request to themselves, cannot send a request
 * to a user they are already friends with, and cannot send a duplicate request.
 * @param {Object} req - Express request object containing the authenticated user and recipient ID.
 * @param {Object} res - Express response object used to send back the appropriate response.
 * @returns {Promise<void>} - Sends a JSON response indicating the result of the friend request operation.
 */
export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user.id;
    const { id: recipientId } = req.params;

    // prevent sending req to yourself
    if (myId === recipientId) {
      return res.status(400).json({ message: "You can't send friend request to yourself" });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // check if user is already friends
    if (recipient.friends.includes(myId)) {
      return res.status(400).json({ message: "You are already friends with this user" });
    }

    // check if a req already exists
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

/**
 * Accepts a friend request from another user.
 * @param {Object} req - Express request object containing the friend request ID and authenticated user.
 * @param {Object} res - Express response object used to send back the appropriate response.
 * @returns {Promise<void>} - Sends a JSON response indicating the result of the friend request operation.
 * @throws {Error} - If an error occurs during the execution of the controller, an error is thrown with a descriptive message.
 */
export async function acceptFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;

    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    // Verify the current user is the recipient
    if (friendRequest.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to accept this request" });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    // add each user to the other's friends array
    // $addToSet: adds elements to an array only if they do not already exist.
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
 * Retrieves all incoming and accepted friend requests of the authenticated user.
 * @param {Object} req - Express request object containing the authenticated user.
 * @param {Object} res - Express response object used to send back the appropriate response.
 * @returns {Promise<Object>} - A JSON response containing the incoming and accepted friend requests of the authenticated user.
 */
export async function getFriendRequests(req, res) {
  try {
    const incomingReqs = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");

    const acceptedReqs = await FriendRequest.find({
      sender: req.user.id,
      status: "accepted",
    }).populate("recipient", "fullName profilePic");

    res.status(200).json({ incomingReqs, acceptedReqs });
  } catch (error) {
    console.log("Error in getPendingFriendRequests controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * Retrieves all outgoing friend requests of the authenticated user.
 * @param {Object} req - Express request object containing the authenticated user.
 * @param {Object} res - Express response object used to send back the appropriate response.
 * @returns {Promise<Object[]>} - A JSON response containing the outgoing friend requests of the authenticated user.
 */
export async function getOutgoingFriendReqs(req, res) {
  try {
    const outgoingRequests = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");

    res.status(200).json(outgoingRequests);
  } catch (error) {
    console.log("Error in getOutgoingFriendReqs controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}