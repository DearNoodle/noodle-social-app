const { Router } = require('express');
const controller = require('../controllers/authController');
const { localAuth, jwtAuth, githubAuth, githubCBAuth } = require('./middlewares/routeAuth');
const validateRegister = require('./middlewares/validateRegister');

const router = Router();

router.get('/user', jwtAuth, controller.getUserId);
router.post('/register', validateRegister, controller.registerLocalUser);
router.post('/login/local', localAuth, controller.loginLocalUser);
router.get('/login/github', githubAuth);
router.get('/login/github/callback', githubCBAuth, controller.loginGHUser);
router.post('/logout', jwtAuth, controller.logoutUser);

module.exports = router;
