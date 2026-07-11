import prisma from '../config/db.js';

export const syncUser = async (req, res) => {
  const { uid, email, name, picture } = req.user;

  try {
    const user = await prisma.user.upsert({
      where: { firebaseId: uid },
      update: {
        email: email,
        displayName: name,
        photoURL: picture,
      },
      create: {
        firebaseId: uid,
        email: email,
        displayName: name,
        photoURL: picture,
      },
    });

    res.status(200).json(user);
  } catch (error) {
    console.error('Error syncing user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getMe = async (req, res) => {
  const { uid } = req.user;

  try {
    const user = await prisma.user.findUnique({
      where: { firebaseId: uid },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
