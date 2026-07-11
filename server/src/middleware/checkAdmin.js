import prisma from '../config/db.js';

export const checkAdmin = async (req, res, next) => {
  const { uid } = req.user;

  try {
    const user = await prisma.user.findUnique({
      where: { firebaseId: uid },
      select: { role: true }
    });

    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied: Admins only' });
    }

    next();
  } catch (error) {
    console.error('Error checking admin role:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
