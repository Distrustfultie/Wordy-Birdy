import { axiosInstance } from "./axios";

// ---------- auth ----------

export const signup = async (signUpData) => {
  const response = await axiosInstance.post("/auth/signup", signUpData);
  return response.data;
};

export const login = async (loginData) => {
  const response = await axiosInstance.post("/auth/login", loginData);
  return response.data;
};

export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

/** The logged-in user, or null when not authenticated. */
export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    if (error.response?.status === 401) return null;
    console.log("Error in getAuthUser: ", error);
    throw error;
  }
};

export const completeOnboarding = async (userData) => {
  const response = await axiosInstance.post("/auth/onboarding", userData);
  return response.data;
};

// ---------- users & profiles ----------

/** Recommended partners. `params` may include `search` and `language`. */
export async function getRecommendedUsers(params = {}) {
  const response = await axiosInstance.get("/user", { params });
  return response.data;
}

export async function getUserProfile(userId) {
  const response = await axiosInstance.get(`/user/${userId}`);
  return response.data;
}

export async function updateProfile(profileData) {
  const response = await axiosInstance.put("/user/me", profileData);
  return response.data;
}

// ---------- friends ----------

export async function getUserFriends() {
  const response = await axiosInstance.get("/user/friends");
  return response.data;
}

export async function removeFriend(userId) {
  const response = await axiosInstance.delete(`/user/friends/${userId}`);
  return response.data;
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
  const response = await axiosInstance.put(`/user/friend-request/${requestId}/accept`);
  return response.data;
}

/** Declines an incoming request, or cancels one you sent. */
export async function deleteFriendRequest(requestId) {
  const response = await axiosInstance.delete(`/user/friend-request/${requestId}`);
  return response.data;
}

// ---------- chat ----------

export async function getStreamToken() {
  const response = await axiosInstance.get("/chat/token");
  return response.data;
}
