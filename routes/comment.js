const router = require('express').Router();
const User = require('../model/User');
const Post = require('../model/Post');
const Comment = require('../model/Comment');
const auth = require('./verifyToken');
const { commentValidation, deleteCommentValidation } = require('../validation');
const util = require('../lib/util');

router.get('/ping', (req, res) => {
	res.status(200).send({ message: 'OK!' });
});

router.post('/new', auth, async (req, res) => {
	const date = new Date();
	const epoch = date.getTime();

	// Validation
	const { error } = commentValidation(req.body);
	if (error) return res.status(400).send({ error: error.details[0].message });
	const comment = new Comment({
		title: req.body.title,
		user: req.user.username,
		created_at: epoch,
		body: req.body.body,
		postid: req.body.postid
	});
	try {
		const post = await Post.findById(comment.postid);
		if (!post) return res.status(404).send({ error: 'No post found!' });
		const newDoc = await comment.save();
		res.status(201).send({
			message: 'Comment was successfully posted',
			payload: comment,
			action: 'ADD_COMMENT'
		});
	} catch (err) {
		util.error(err);
		res.status(400).send({ error: err.message });
	}
});

router.delete('/delete', auth, async (req, res) => {
// Validation
	const { error } = deleteCommentValidation(req.body);
	if (error) return res.status(400).send({ error: error.details[0].message });
	try {
		// Find post & Comment
		const post = await Post.findById(req.body.postid);
		const comment = await Comment.findById(req.body.commentid);
		if (!post) return res.status(404).send({ error: 'No post found!' });
		if (!comment) return res.status(404).send({ error: 'No comment found!' });

		 // Check if user can delete and delete comment
		const checkPermission = await util.checkPermission(req.user, 'REMOVE_COMMENT');
		if (comment.user == req.user.username || checkPermission) comment.deleteOne({ id: req.body.commentid });
		if (comment.user !== req.user.username && !checkPermission) return res.status(403).send({ error: 'This is not your comment hence you are unable to delete it' });

		// Return message
		return res.status(200).send({
			message: 'Comment was successfully deleted',
			action: 'DELTE_COMMENT'
		});
	} catch (err) {
		console.log(err);
		util.error(err.message);
		res.status(400).send({ error: err.message });
	}
});

module.exports = router;
