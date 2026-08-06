const { Router } = require('express');
const controller = require('../controllers/commentController');
const { jwtAuth } = require('./middlewares/routeAuth');

const router = Router();

router.post('/comment/post/:id', jwtAuth, controller.createComment);
router.delete('/comment/:id', jwtAuth, controller.deleteComment);

module.exports = router;
