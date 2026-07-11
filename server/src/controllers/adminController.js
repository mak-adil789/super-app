import prisma from '../config/db.js';

// Events CRUD
export const getAllEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({ orderBy: { date: 'asc' } });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createEvent = async (req, res) => {
  try {
    const event = await prisma.event.create({ data: req.body });
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = await prisma.event.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    await prisma.event.delete({ where: { id: req.params.id } });
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Lectures CRUD
export const getAllLectures = async (req, res) => {
  try {
    const lectures = await prisma.lecture.findMany({ orderBy: { date: 'desc' } });
    res.json(lectures);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createLecture = async (req, res) => {
  try {
    const lecture = await prisma.lecture.create({ data: req.body });
    res.status(201).json(lecture);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateLecture = async (req, res) => {
  try {
    const lecture = await prisma.lecture.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(lecture);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteLecture = async (req, res) => {
  try {
    await prisma.lecture.delete({ where: { id: req.params.id } });
    res.json({ message: 'Lecture deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Duas CRUD
export const getAllDuas = async (req, res) => {
  try {
    const duas = await prisma.dua.findMany({ orderBy: { category: 'asc' } });
    res.json(duas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createDua = async (req, res) => {
  try {
    const dua = await prisma.dua.create({ data: req.body });
    res.status(201).json(dua);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateDua = async (req, res) => {
  try {
    const dua = await prisma.dua.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(dua);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteDua = async (req, res) => {
  try {
    await prisma.dua.delete({ where: { id: req.params.id } });
    res.json({ message: 'Dua deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
