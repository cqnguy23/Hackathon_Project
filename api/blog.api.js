const express = require('express');
const router = express.Router();

const blogController = require('../controllers/blog.controller');

router.post('/', blogController.create);
router.get('/', blogController.getBlogs);
router.get('/:slug', blogController.getSingleBlog);
router.put('/:slug', blogController.update);
router.delete('/:slug', blogController.destroy);

module.exports = router;
