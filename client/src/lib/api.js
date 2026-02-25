import { axiosInstance } from "./axios";

/**
 * Signs up a new user.
 */
export const signup = async (signUpData) => {
  const response = await axiosInstance.post("/auth/signup", signUpData);
  return response.data;
};

/**
 * Logs in a user.
 */
export const login = async (loginData) => {
  const response = await axiosInstance.post("/auth/login", loginData);
  return response.data;
};

/**
 * Logs out the current user.
 */
export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

/**
 * Fetches the authenticated user from the server.
 */
export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    if (error.response?.status === 401) return null; // ✅ key fix
    console.log("Error in getAuthUser: ", error);
    throw error;
  }
};

/**
 * Completes onboarding.
 */
export const completeOnboarding = async (userData) => {
  const response = await axiosInstance.post("/auth/onboarding", userData);
  return response.data;
};

// -------- user / friends / chat (UNCHANGED) --------

export async function getUserFriends() {
  try {
    const response = await axiosInstance.get("/user/friends");
    return response.data;
  } catch (error) {
    console.log("Error in getUserFriends: ", error);
    return [];
  }
}

export async function getRecommendedUsers() {
  try {
    const response = await axiosInstance.get("/user");
    return response.data;
  } catch (error) {
    console.log("Error in getRecommendedUsers: ", error);
    return [];
  }
}

export async function getOutgoingFriendReqs() {
  const response = await axiosInstance.get("/user/outgoing-friend-requests");
  return response.data;
}

export async function sendFriendRequest(userId) {
  const response = await axiosInstance.post(`/user/friend-request/${userId}`);
  return response.data;
}

export async function getFriendRequests() {
  const response = await axiosInstance.get("/user/friend-requests");
  return response.data;
}

export async function acceptFriendRequest(requestId) {
  const response = await axiosInstance.put(
    `/user/friend-request/${requestId}/accept`
  );
  return response.data;
}

export async function getStreamToken() {
  const response = await axiosInstance.get("/chat/token");
  return response.data;
}