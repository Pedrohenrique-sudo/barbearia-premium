import { Router } from 'express';
import { AppointmentController } from '../controllers/AppointmentController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const appointmentController = new AppointmentController();

router.use(authMiddleware);

router.get('/', (req, res) => appointmentController.index(req, res));
router.post('/', (req, res) => appointmentController.store(req, res));
router.put('/:id', (req, res) => appointmentController.update(req, res));
router.delete('/:id', (req, res) => appointmentController.destroy(req, res));

export default router;
