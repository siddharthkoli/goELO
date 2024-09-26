import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth';
import { confirmMatch, createMatchRequest } from '../controllers/matchController';

const router = Router();

router.post('/create', authenticateJWT, createMatchRequest);

router.post('/confirm', authenticateJWT, confirmMatch);

export default router;
