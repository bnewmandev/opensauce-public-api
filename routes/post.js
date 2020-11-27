const router = require('express').Router();
const User = require('../model/User');
const Post = require('../model/Post');
const Comment = require('../model/Comment');
const auth = require('./verifyToken');
const { postValidation, deletePostValidation } = require('../validation');
const Search = require('../model/Search');
const util = require('../lib/util');

router.get('/ping', (req, res) => {
	res.send({ message: 'OK!' });
});


router.get('/', async (req, res) => {
	const array = [];
	const index = 10;
	if (req.body.limit > 50) req.body.limit = 30;
	const posts = await Post.find().limit(req.body.limit || index).select('-__v');
	const comments = await Comment.find().select('-__v');
	const postArray = posts.map(x => x);
	let i;
	for (i = 0; i < postArray.length; i++) {
		const commentArray = comments.filter(x => x.postid == postArray[i]._id);
		array.push(
			{
				id: postArray[i]._id,
				author: postArray[i].user,
				title: postArray[i].title,
				ingredients: postArray[i].ingredients,
				comments: commentArray || [],
				content: postArray[i].body
			}
		);
	}
	return res.status(200).send({ message: 'Returned list of all posts!', payload: array, action: 'FETCH_POSTS' });
});

router.post('/new', auth, async (req, res) => {
	if (!util.checkPermission(req.user, 'CREATE_POST')) return res.status(401).send({ error: 'Please contact an admin to request the needed permissions to complete this operation', permission: 'CREATE_POST' });

	const date = new Date();
	const epoch = date.getTime();

	// Validation
	const { error } = postValidation(req.body);
	if (error) { return res.status(400).send({ error: error.details[0].message }); }

	const post = new Post({
		title: req.body.title,
		user: req.user.username,
		created_at: epoch,
		body: req.body.body
	});
	const searchRecord = new Search({
		type: 'Post',
		referenceid: post._id,
		name: post.title,
		link: `/posts/${post._id}`
	});

	try {
		const newPost = await post.save();
		const newRecord = await searchRecord.save();
		return res.status(201).send({ payload: post });
	} catch (err) {
		console.log(err);
		res.status(400).send({ error: err.message });
	}
});


router.delete('/delete', auth, async (req, res) => {
	const { error } = deletePostValidation(req.body);
	if (error) { return res.status(401).send(error.details[0].message); }

	const user = await User.findById(req.user._id);
	const post = await Post.findById(req.body.postid);
	if (!post) { return res.status(404).send({ error: 'Could not find post to delete!' }); }
	if (post.user == req.user.username) {
		post.deleteOne({ id: req.body.postid });
		res.status(200).send({ message: 'Post has been deleted' });
	} else { res.status(401).send({ error: 'Access Token provided is invalid' }); }
});


module.exports = router;
