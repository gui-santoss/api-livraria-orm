import express from 'express';
import * as UserController from '../controllers/user.controller.js';

const router = express.Router();

// User routes
router.get('/', UserController.getAllUsers);
router.get('/:userId', UserController.getUser);
router.post('/', UserController.createUser);
router.put('/:userId', UserController.updateUser);
router.delete('/:userId', UserController.deleteUser);

export default router;
