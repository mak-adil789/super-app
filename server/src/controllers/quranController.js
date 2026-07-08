import prisma from '../config/db.js';

export const getBookmarks = async (req, res) => {
  const { uid } = req.user;
  try {
    const user = await prisma.user.findUnique({ where: { firebaseId: uid } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const bookmarks = await prisma.quranBookmark.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(bookmarks);
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const addBookmark = async (req, res) => {
  const { uid } = req.user;
  const { surahId, verseId } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { firebaseId: uid } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const bookmark = await prisma.quranBookmark.upsert({
      where: {
        userId_surahId_verseId: {
          userId: user.id,
          surahId: parseInt(surahId),
          verseId: parseInt(verseId),
        },
      },
      update: {},
      create: {
        userId: user.id,
        surahId: parseInt(surahId),
        verseId: parseInt(verseId),
      },
    });
    res.status(201).json(bookmark);
  } catch (error) {
    console.error('Error adding bookmark:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const removeBookmark = async (req, res) => {
  const { uid } = req.user;
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({ where: { firebaseId: uid } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    await prisma.quranBookmark.deleteMany({
      where: { id, userId: user.id },
    });
    res.status(200).json({ message: 'Bookmark removed' });
  } catch (error) {
    console.error('Error removing bookmark:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateProgress = async (req, res) => {
  const { uid } = req.user;
  const { lastSurah, lastVerse, percentage } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { firebaseId: uid } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const progress = await prisma.quranProgress.upsert({
      where: { userId: user.id },
      update: {
        lastSurah: parseInt(lastSurah),
        lastVerse: parseInt(lastVerse),
        percentage: parseFloat(percentage),
      },
      create: {
        userId: user.id,
        lastSurah: parseInt(lastSurah),
        lastVerse: parseInt(lastVerse),
        percentage: parseFloat(percentage),
      },
    });
    res.status(200).json(progress);
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getProgress = async (req, res) => {
  const { uid } = req.user;
  try {
    const user = await prisma.user.findUnique({ where: { firebaseId: uid } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const progress = await prisma.quranProgress.findUnique({
      where: { userId: user.id },
    });
    res.status(200).json(progress || {});
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
