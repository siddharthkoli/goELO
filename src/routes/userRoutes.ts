import { Router } from 'express';
import { signup, login } from '../controllers/userController';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);

import { authenticateJWT } from '../middleware/auth';

router.get('/profile', authenticateJWT, (req, res) => {
  // Protected route logic here
  res.json({ message: 'This is a protected route', user: (req as any).user });
});


export default router;
