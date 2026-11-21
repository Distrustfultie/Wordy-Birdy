import { upsertStreamUser } from "./stream.js";

// Fields other users may see. Never include email or password.
export const PUBLIC_USER_FIELDS =
  "fullName profilePic bio nativeLanguage learningLanguage location createdAt";

const LIMITS = { fullName: 60, bio: 300, nativeLanguage: 40, learningLanguage: 40, location: 80 };

/**
 * Builds a safe profile update from a request body.
 * Only whitelisted profile fields are accepted, trimmed and length-checked.
 * @returns {{ updates?: Object, error?: string }}
 */
export function buildProfileUpdate(body = {}) {
  const updates = {};

  for (const [field, max] of Object.entries(LIMITS)) {
    const value = typeof body[field] === "string" ? body[field].trim() : "";
    if (!value) return { error: "All fields are required" };
    if (value.length > max) return { error: `${field} must be at most ${max} characters` };
    updates[field] = value;
  }

  if (updates.nativeLanguage.toLowerCase() === updates.learningLanguage.toLowerCase()) {
    return { error: "Native and learning languages must be different" };
  }

  if (typeof body.profilePic === "string" && body.profilePic.trim()) {
    const pic = body.profilePic.trim();
    if (!/^https:\/\//i.test(pic)) return { error: "Profile picture must be an https URL" };
    updates.profilePic = pic;
  }

  return { updates };
}

/** Keeps the user's Stream Chat identity (name/avatar) in sync with their profile. */
export async function syncStreamUser(user) {
  try {
    await upsertStreamUser({
      id: user._id.toString(),
      name: user.fullName,
      image: user.profilePic || "",
    });
  } catch (error) {
    console.log("Error syncing Stream user:", error);
  }
}
