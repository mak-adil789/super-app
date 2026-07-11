// This file was previously using firebase-admin which caused ERR_REQUIRE_ESM on Vercel.
// Token verification has been moved to src/middleware/auth.js using the 'jose' library.
// If you need other Firebase Admin features (like Messaging or Firestore),
// consider using a compatible version or alternative approach.

export const app = null;
export const auth = null;
