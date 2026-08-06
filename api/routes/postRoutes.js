const { Router } = require('express');
const controller = require('../controllers/postController');
const { jwtAuth } = require('./middlewares/routeAuth');
const { upload } = require('../configs/cloudinaryConfig');

const router = Router();

router.post('/post', jwtAuth, upload.single('image'), controller.createPost);
router.delete('/post/:id', jwtAuth, controller.deletePost);

module.exports = router;
