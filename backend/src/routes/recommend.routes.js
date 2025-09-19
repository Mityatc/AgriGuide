import { Router } from 'express';
import { recommendController } from '../controllers/recommend.controller.js';

const router = Router();

router.post('/', recommendController.createRecommendation);

export default router;


