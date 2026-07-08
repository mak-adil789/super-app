import prisma from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

// Simple invite code generator (8 chars)
const generateInviteCode = () => {
  return uuidv4().split('-')[0].toUpperCase();
};

export const createFamily = async (req, res) => {
  const { uid } = req.user;
  const { name } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { firebaseId: uid } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.familyId) return res.status(400).json({ error: 'User already in a family' });

    const inviteCode = generateInviteCode();

    const family = await prisma.family.create({
      data: {
        name,
        inviteCode,
        members: {
          connect: { id: user.id }
        }
      },
      include: { members: true }
    });

    res.status(201).json(family);
  } catch (error) {
    console.error('Error creating family:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const joinFamily = async (req, res) => {
  const { uid } = req.user;
  const { inviteCode } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { firebaseId: uid } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.familyId) return res.status(400).json({ error: 'User already in a family' });

    const family = await prisma.family.findUnique({
      where: { inviteCode: inviteCode.toUpperCase() }
    });

    if (!family) return res.status(404).json({ error: 'Invalid invite code' });

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { familyId: family.id },
      include: { family: true }
    });

    res.status(200).json(updatedUser.family);
  } catch (error) {
    console.error('Error joining family:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getFamilyData = async (req, res) => {
  const { uid } = req.user;

  try {
    const user = await prisma.user.findUnique({
      where: { firebaseId: uid },
      include: {
        family: {
          include: {
            members: {
              select: {
                id: true,
                displayName: true,
                photoURL: true,
                email: true,
                progress: true,
              }
            }
          }
        }
      }
    });

    if (!user || !user.family) return res.status(404).json({ error: 'Family not found' });

    res.status(200).json(user.family);
  } catch (error) {
    console.error('Error fetching family data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const leaveFamily = async (req, res) => {
  const { uid } = req.user;

  try {
    const user = await prisma.user.findUnique({ where: { firebaseId: uid } });
    if (!user || !user.familyId) return res.status(400).json({ error: 'Not in a family' });

    await prisma.user.update({
      where: { id: user.id },
      data: { familyId: null }
    });

    // Optional: Delete family if no members left
    const membersCount = await prisma.user.count({ where: { familyId: user.familyId } });
    if (membersCount === 0) {
      await prisma.family.delete({ where: { id: user.familyId } });
    }

    res.status(200).json({ message: 'Left family' });
  } catch (error) {
    console.error('Error leaving family:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
