const express = require('express');
const router = express.Router();
const prisma = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const where = req.user.role === 'STUDENT' ? { userId: req.user.id } : {};
    const enrollments = await prisma.enrollment.findMany({
      where,
      include: {
        user: { select: { id: true, firstName: true, lastName: true } },
        course: true
      },
      orderBy: { enrolledAt: 'desc' }
    });
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch enrollments' });
  }
});

router.post('/', roleMiddleware('ADMIN', 'STUDENT'), async (req, res) => {
  const userId = req.user.role === 'STUDENT' ? req.user.id : Number(req.body.userId);
  const courseId = Number(req.body.courseId);

  if (!courseId) return res.status(400).json({ error: 'courseId is required' });

  try {
    const enrollment = await prisma.enrollment.create({
      data: { userId, courseId },
      include: { user: { select: { id: true, firstName: true, lastName: true } }, course: true }
    });
    res.status(201).json(enrollment);
  } catch (error) {
    if (error.code === 'P2002') return res.status(409).json({ error: 'Already enrolled in this course' });
    if (error.code === 'P2003') return res.status(404).json({ error: 'User or course not found' });
    res.status(500).json({ error: 'Failed to enroll' });
  }
});

router.patch('/:id/grade', roleMiddleware('ADMIN', 'TEACHER'), async (req, res) => {
  const { grade } = req.body;
  if (!grade || !['A', 'B', 'C', 'D', 'F'].includes(grade.toUpperCase())) {
    return res.status(400).json({ error: 'Grade must be A, B, C, D, or F' });
  }
  try {
    const enrollment = await prisma.enrollment.update({
      where: { id: Number(req.params.id) },
      data: { grade: grade.toUpperCase() },
      include: { user: { select: { id: true, firstName: true, lastName: true } }, course: true }
    });
    res.json(enrollment);
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Enrollment not found' });
    res.status(500).json({ error: 'Failed to assign grade' });
  }
});

router.delete('/:id', roleMiddleware('ADMIN'), async (req, res) => {
  try {
    await prisma.enrollment.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Enrollment removed' });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Enrollment not found' });
    res.status(500).json({ error: 'Failed to remove enrollment' });
  }
});

module.exports = router;