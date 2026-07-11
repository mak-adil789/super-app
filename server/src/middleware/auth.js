import { jwtVerify, createRemoteJWKSet } from 'jose';
import dotenv from 'dotenv';

dotenv.config();

const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
const FIREBASE_JWKS_URL = 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';

const JWKS = createRemoteJWKSet(new URL(FIREBASE_JWKS_URL));

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  if (!FIREBASE_PROJECT_ID) {
    console.error('FIREBASE_PROJECT_ID is not defined in environment variables');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const { payload } = await jwtVerify(idToken, JWKS, {
      issuer: `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`,
      audience: FIREBASE_PROJECT_ID,
      algorithms: ['RS256'],
    });

    // Firebase UID is in the 'sub' field
    req.user = {
      ...payload,
      uid: payload.sub,
    };
    next();
  } catch (error) {
    console.error('Error verifying Firebase token with jose:', error.message);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};
