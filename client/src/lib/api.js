import { axiosInstance } from "./axios";

/**
 * Signs up a new user.
 * @param {Object} signUpData - The data of the user to be signed up.
 * @prop {string} fullName - The full name of the user.
 * @prop {string} email - The email of the user.
 * @prop {string} password - The password of the user.
 * @returns {Promise<Object>} - The response data from the server.
 */
export const signup = async (signUpData) => {
    const response = await axiosInstance.post("/auth/signup", signUpData);
    return response.data;
};

/**
 * Logs in a user.
 * @param {Object} loginData - The data of the user to be logged in.
 * @prop {string} email - The email of the user.
 * @prop {string} password - The password of the user.
 * @returns {Promise<Object>} - The response data from the server.
 */
export const login = async (loginData) => {
    const response = await axiosInstance.post("/auth/login", loginData);
    return response.data;
};

/**
 * Logs out the current user.
 * @returns {Promise<Object>} - The response data from the server.
 */
export const logout = async () => {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
};

/**
 * Fetches the authenticated user from the server.
 * @returns {Promise<Object | null>} - The user data if the user is authenticated, null otherwise.
 */
export const getAuthUser = async () => {
    try {
        const res = await axiosInstance.get("/auth/me");
        return res.data;
    } catch (error) {
        console.log("Error in getAuthUser: ", error);
        return null;
    }
};


/**
 * Completes the onboarding process for a user.
 * @param {Object} userData - The data of the user completing onboarding.
 * @prop {string} fullName - The full name of the user.
 * @prop {string} bio - The bio of the user.
 * @prop {string} nativeLanguage - The native language of the user.
 * @prop {string} learningLanguage - The language the user is learning.
 * @prop {string} location - The location of the user.
 * @prop {string} profilePic - The profile picture of the user.
 * @returns {Promise<Object>} - The response data from the server.
 */
export const completeOnboarding = async (userData) => {
    const response = await axiosInstance.post("/auth/onboarding", userData);
    return response.data;
};

/**
 * Fetches the list of friends for the authenticated user.
 * @returns {Promise<Object[] | []>} - The list of friends if the request is successful, an empty array otherwise.
 */
export async function getUserFriends() {
    try {
        const response = await axiosInstance.get("/user/friends");
        return response.data;
    } catch (error) {
        console.log("Error in getUserFriends: ", error);
        return [];
    }
}

/**
 * Fetches a list of recommended users that the authenticated user can send a friend request to.
 * The list is sorted by the language the user is learning, and the users are limited to those
 * who have completed the onboarding process.
 * @returns {Promise<Object[] | null>} - The list of recommended users if the request is successful, null otherwise.
 */
export async function getRecommendedUsers() {
    try {
        const response = await axiosInstance.get("/user");
        return response.data;
    } catch (error) {
        console.log("Error in getRecommendedUsers: ", error);
        return [];
    }
}

/**
 * Fetches the list of outgoing friend requests for the authenticated user.
 * @returns {Promise<Object[] | null>} - The list of outgoing friend requests if the request is successful, null otherwise.
 */
export async function getOutgoingFriendReqs() {
    const response = await axiosInstance.get("/user/outgoing-friend-requests");
    return response.data;
}

/**
 * Sends a friend request to a user.
 * @param {string} userId - The ID of the user to send the friend request to.
 * @returns {Promise<Object>} - The response data from the server.
 */
export async function sendFriendRequest(userId) {
    const response = await axiosInstance.post(`/user/friend-request/${userId}`);
    return response.data;
}

/**
 * Fetches a list of friend requests for the authenticated user. The list
 * contains the full details of the users that have sent the requests, as well
 * as the status of the request (incoming or accepted).
 * @returns {Promise<Object[] | null>} - The list of friend requests if the
 * request is successful, null otherwise.
 */
export async function getFriendRequests() {
    const response = await axiosInstance.get("/user/friend-requests");
    return response.data;
}

/**
 * Accepts a friend request by ID.
 * @param {string} requestId - The ID of the friend request to accept.
 * @returns {Promise<Object>} - The response data from the server.
 */
export async function acceptFriendRequest(requestId) {
    const response = await axiosInstance.put(`/user/friend-request/${requestId}/accept`);
    return response.data;
}


/**
 * Fetches a Stream Chat token for the authenticated user.
 * @returns {Promise<Object>} - The response data from the server, containing
 * the Stream Chat token.
 */
export async function getStreamToken() {
    const response = await axiosInstance.get("/chat/token");
    return response.data;
}