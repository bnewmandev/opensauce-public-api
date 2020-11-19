const router = require('express').Router();
const User = require('../model/User');
const Post = require('../model/Post');
const Comment = require('../model/Comment');
const auth = require('./verifyToken');
const { postValidation, commentValidation } = require('../validation');
const util = require('../lib/util');

router.get('/ping', (req, res) => {
	res.status(200).send({ message: 'OK!' });
});

router.post('/new', auth, async (req, res) => {
	const d = new Date();
	const epoch = d.getTime();

	// Validation
	const { error } = commentValidation(req.body);
	if (error) { return res.status(400).send({ error: error.details[0].message }); }
	const comment = new Comment({
		title: req.body.title,
		user: req.user.username,
		created_at: epoch,
		body: req.body.body,
		postid: req.body.postid
	});
	try {
		const post = await Post.findById(comment.postid);
		if (!post) { return res.status(500).send({ error: 'No post found!' }); }
		const postComments = post.comments;
		postComments.push(comment);
		const doc = await Post.findByIdAndUpdate(comment.postid, { comments: postComments });
		const newDoc = await comment.save();
		res.status(201).send({
			message: 'Comment was successfully posted',
			payload: comment
		});
	} catch (err) {
		util.error(err);
		res.status(400).send({ error: err.message });
	}
});

module.exports = router;
