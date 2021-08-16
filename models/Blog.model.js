const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const blogSchema = Schema(
	{
		title: { type: String, required: true },
		slug: { type: String, required: true, unique: true },
		cover_photo: { type: String },
		body: { type: String, required: true },
		author: { type: String, required: true },
	},
	{
		timestamps: true,
	}
);

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
