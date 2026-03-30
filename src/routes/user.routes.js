import express from 'express';
import * as controller from '../controllers/user.js';

const router = express.Router();

router.get('/', controller.getAllUsers);
router.get('/:userId', controller.getUser);
router.post('/', controller.createUser);
router.put('/:userId', controller.updateUser);
router.delete('/:userId', controller.deleteUser);

export default router;
