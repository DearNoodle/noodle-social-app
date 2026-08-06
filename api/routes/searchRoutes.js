const { Router } = require('express');
const controller = require('../controllers/searchController');
const { jwtAuth } = require('./middlewares/routeAuth');

const router = Router();

router.get('/search/posts', jwtAuth, controller.getSearchPosts);
router.get('/search/users', jwtAuth, controller.getSearchUsers);

module.exports = router;
