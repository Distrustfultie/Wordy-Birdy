import express from "express";
import { protectRoute } from "../middleware/auth.js";
import {
  acceptFriendRequest,
  deleteFriendRequest,
  getFriendRequests,
  getMyFriends,
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserProfile,
  removeFriend,
  sendFriendRequest,
  updateMyProfile,
} from "../Controllers/user.js";

const router = express.Router();

router.use(protectRoute);

router.get("/", getRecommendedUsers);
router.put("/me", updateMyProfile);

router.get("/friends", getMyFriends);
router.delete("/friends/:id", removeFriend);

router.post("/friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);
router.delete("/friend-request/:id", deleteFriendRequest);

router.get("/friend-requests", getFriendRequests);
router.get("/outgoing-friend-requests", getOutgoingFriendReqs);

// Keep last: matches any single path segment.
router.get("/:id", getUserProfile);

export default router;
