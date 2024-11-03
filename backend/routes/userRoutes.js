const express = require('express');
const { signup, login, getAllUsers, createUser, deleteUser } = require('../controllers/userController');
const { adminMiddleware,authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', signup); 
router.post('/login', login);
router.get('/',authMiddleware, adminMiddleware, getAllUsers); 
router.post('/',authMiddleware, adminMiddleware, createUser); 
router.delete('/delete/:id',authMiddleware,adminMiddleware,deleteUser);

module.exports = router;
