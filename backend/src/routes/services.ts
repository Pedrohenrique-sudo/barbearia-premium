import { Router } from 'express';
import { ServiceController } from '../controllers/ServiceController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const serviceController = new ServiceController();

router.use(authMiddleware);

router.get('/', (req, res) => serviceController.index(req, res));
router.post('/', (req, res) => serviceController.store(req, res));
router.put('/:id', (req, res) => serviceController.update(req, res));
router.delete('/:id', (req, res) => serviceController.destroy(req, res));

export default router;
