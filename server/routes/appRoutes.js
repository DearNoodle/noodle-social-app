const { Router } = require('express');
const controller = require('../controllers/appController');
const { jwtAuth } = require('./middlewares/routeAuth');

const router = Router();

router.get('/user/:id', jwtAuth, controller.getUserInfo);

router.put('/follow/user/:id', jwtAuth, controller.updateFollow);

router.put('/like/post/:id', jwtAuth, controller.updateLike);

module.exports = router;
