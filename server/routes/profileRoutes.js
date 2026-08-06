const { Router } = require('express');
const controller = require('../controllers/profileController');
const { jwtAuth } = require('./middlewares/routeAuth');
const { upload } = require('../configs/cloudinaryConfig');

const router = Router();

router.put('/profile/image', jwtAuth, upload.single('image'), controller.updateProfileImage);
router.put('/profile/bio', jwtAuth, controller.updateProfileBio);

module.exports = router;
