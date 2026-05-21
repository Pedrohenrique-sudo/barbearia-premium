import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { ProfileController } from '../controllers/ProfileController';
import { authMiddleware, AuthRequest } from '../middlewares/auth';
import { authRateLimiter } from '../middlewares/rateLimiter';

const router = Router();
const authController = new AuthController();
const profileController = new ProfileController();

router.post('/register', authRateLimiter, (req, res) => authController.register(req, res));
router.post('/login', authRateLimiter, (req, res) => authController.login(req, res));
router.get('/me', authMiddleware, (req: AuthRequest, res) => authController.me(req, res));
router.put('/profile', authMiddleware, (req: AuthRequest, res) => profileController.update(req, res));
router.put('/password', authMiddleware, (req: AuthRequest, res) => profileController.changePassword(req, res));

export default router;
