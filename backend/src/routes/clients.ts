import { Router } from 'express';
import { ClientController } from '../controllers/ClientController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const clientController = new ClientController();

router.use(authMiddleware);

router.get('/', (req, res) => clientController.index(req, res));
router.get('/:id', (req, res) => clientController.show(req, res));
router.post('/', (req, res) => clientController.store(req, res));
router.put('/:id', (req, res) => clientController.update(req, res));
router.delete('/:id', (req, res) => clientController.destroy(req, res));

export default router;
