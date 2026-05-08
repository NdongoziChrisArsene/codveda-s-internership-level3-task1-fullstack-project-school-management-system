const express = require('express');
const router = express.Router();
const prisma = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: { enrollments: { include: { user: { select: { id: true, firstName: true, lastName: true } } } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: Number(req.params.id) },
      include: { enrollments: { include: { user: { select: { id: true, firstName: true, lastName: true } } } } }
    });
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

router.post('/', roleMiddleware('ADMIN'), async (req, res) => {
  const { title, description, credits } = req.body;
  if (!title || title.trim().length < 3) {
    return res.status(400).json({ error: 'Title must be at least 3 characters' });
  }
  try {
    const course = await prisma.course.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        credits: Number(credits) || 3,
      }
    });
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create course' });
  }
});

router.put('/:id', roleMiddleware('ADMIN'), async (req, res) => {
  const { title, description, credits } = req.body;
  if (!title || title.trim().length < 3) {
    return res.status(400).json({ error: 'Title must be at least 3 characters' });
  }
  try {
    const course = await prisma.course.update({
      where: { id: Number(req.params.id) },
      data: { title: title.trim(), description: description?.trim() || null, credits: Number(credits) || 3 }
    });
    res.json(course);
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Course not found' });
    res.status(500).json({ error: 'Failed to update course' });
  }
});

router.delete('/:id', roleMiddleware('ADMIN'), async (req, res) => {
  try {
    await prisma.course.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Course not found' });
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

module.exports = router;