const Blog = require('../models/Blog.model');

const { AppError, catchAsync, sendResponse } = require('../helpers/utils.helper');
const utilsHelper = require('../helpers/utils.helper');
const User = require('../models/User.model');
const Item = require('../models/Item.model');
const { getDistance } = require('geolib');

const blogsController = {};

blogsController.create = catchAsync(async (req, res, next) => {
	let { title, author, cover_photo, body, slug } = req.body;
	if (!title || !author || !body || !slug) {
		return utilsHelper.sendResponse(res, 400, false, null, null, 'Missing required field(s)!');
	}
	const blog = await Blog.create({
		title,
		author,
		cover_photo,
		body,
		slug,
	});

	return utilsHelper.sendResponse(res, 200, true, blog, null, 'Blog created sucessfully');
});

blogsController.getBlogs = catchAsync(async (req, res) => {
	let { page, limit, ...filter } = { ...req.query };
	page = parseInt(page) || 1;
	limit = parseInt(limit) || 5;
	const totalBlogs = await Blog.countDocuments({
		...filter,
	});
	const totalPages = Math.ceil(totalBlogs / limit);
	const offset = limit * (page - 1);
	const blogs = await Blog.find(filter).sort({ createdAt: -1 }).skip(offset).limit(limit);
	return utilsHelper.sendResponse(res, 200, true, { blogs, totalPages }, null, 'Get blogs sucessfully');
});

blogsController.getSingleBlog = catchAsync(async (req, res) => {
	const { slug } = req.params;
	const blog = await Blog.findOne({ slug });
	if (blog) return utilsHelper.sendResponse(res, 200, true, blog, null, 'Get blog sucessfully');
	return utilsHelper.sendResponse(res, 404, true, blog, null, 'Blog not found!');
});

blogsController.update = catchAsync(async (req, res) => {
	let blogSlug = req.params.slug;
	let { title, author, cover_photo, body, slug } = req.body;
	let blog = await Blog.findOneAndUpdate({ slug: blogSlug }, { title, author, cover_photo, body, slug }, { new: true });
	return utilsHelper.sendResponse(res, 200, true, blog, null, 'Blog updated sucessfully');
});

blogsController.destroy = catchAsync(async (req, res) => {
	const { slug } = req.body;
	const blog = await Blog.findOne({ slug });
	if (blog) {
		await Blog.findByIdAndDelete(blog._id);
		return utilsHelper.sendResponse(res, 200, true, blog, null, 'Blog deleted sucessfully');
	} else {
		return next(new AppError(400, 'Blog cannot be found'));
	}
});

module.exports = blogsController;
