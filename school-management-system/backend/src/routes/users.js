const express = require('express');
const router = express.Router();
const prisma = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);

router.get('/', roleMiddleware('ADMIN'), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, firstName: true, lastName: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.patch('/:id/role', roleMiddleware('ADMIN'), async (req, res) => {
  const { role } = req.body;
  if (!['ADMIN', 'TEACHER', 'STUDENT'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }
  try {
    const user = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: { role },
      select: { id: true, firstName: true, lastName: true, email: true, role: true }
    });
    res.json(user);
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'User not found' });
    res.status(500).json({ error: 'Failed to update role' });
  }
});

router.delete('/:id', roleMiddleware('ADMIN'), async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'User not found' });
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;