const router = require('express').Router();
const auth = require('./verifyToken');
const User = require('../model/User');
const util = require('../lib/util');

router.post('/ping', (req, res) => {
	res.status(200).send({ message: 'OK!', endpoint: 'Permissions' });
});

router.put('/:username/permissions/add', auth, async (req, res) => {
	// Check if User can change permissions
	if (!util.checkPermission(req.user, 'ADD_PERMISSIONS')) return res.status(403).send({ error: 'Please contact an admin to request the needed permission to perform this operation', permission: 'ADD_PERMISSIONS' });
	const user = await User.findOne({ username: req.params.username })
	// check if the user is available
	if (!user) return res.status(404).send({ error: 'Could not find user!' });
	// grab permissions
	let permission = user.permissions;
	const permissions_added = req.body.permissions;
	if (!permissions_added.length) return res.status(400).send({ error: 'Permissions to be added is empty!' })
	// add permissions to the array
	let i;
	for (i = 0; i < permissions_added.length; i++) {
		permission.push(permissions_added[i]);
	}
	// Removve duplicates
	permission = new Set(permission);
	permission = [...permission];
	// save data
	try {
		const payload = User.findOne({ username: user.username }, (err, user) => {
			user.permissions = permission;
			user.save();
		});
	} catch (error) {
		util.error(error);
	}
	// return message and payload
	const payload = {
		user: {
			name: user.name,
			username: user.username,
			id: user.id,
			permissions: permission,
			added_permissions: permissions_added,
			action: 'ADDED_PERMISSIONS'
		}
	};
	return res.status(200).send({ message: 'Successfully added permissions to the user', payload: payload });
});

router.delete('/:username/permissions/remove', auth, async (req, res) => {
	// Check if User can change permissions
	if (!util.checkPermission(req.user, 'REMOVE_PERMISSIONS')) return res.status(403).send({ error: 'Please contact an admin to request the needed permission to perform this operation', permission: 'REMOVE_PERMISSIONS' });
	const user = await User.findOne({ username: req.body.username })
	// check if the user is available
	if (!user) return res.status(404).send({ error: 'Could not find user!' });
	// grab permissions
	let permission = user.permissions;
	const permissions_removed = req.body.permissions;
	// Remove permissions from the array
	let i;
	for (i = 0; i < permissions_removed.length; i++) {
		permission = permission.filter(e => e !== permissions_removed[i]);
	}
	// Removve duplicates
	permission = new Set(permission);
	permission = [...permission];
	// save data
	try {
		User.findOne({ username: user.username }, (err, user) => {
			user.permissions = permission;
			user.save();
		});
	} catch (error) {
		util.error(error);
	}
	// return message and payload
	const payload = {
		user: {
			name: user.name,
			username: user.username,
			id: user.id,
			permissions: permission,
			removed_permissions: permissions_removed,
			action: 'REMOVE_PERMISSIONS'
		}
	};
	return res.status(200).send({ message: 'Successfully removed permissions from the user', payload: payload });
});

router.post('/:username/permissions/reset', auth, async (req, res) => {
	// Check if User can change permissions
	if (!util.checkPermission(req.user, 'RESET_PERMISSIONS')) return res.status(403).send({ error: 'Please contact an admin to request the needed permission to perform this operation', permission: 'RESET_PERMISSIONS' });
	const user = await User.findOne({ username: req.params.username })
	// check if the user is available
	if (!user) return res.status(404).send({ error: 'Could not find user!' });
	const default_perms = User.schema.paths.permissions.options.default;
	// reset data
	try {
		User.findOne({ username: user.username }, (err, user) => {
			user.permissions = default_perms;
			user.save();
		});
	} catch (error) {
		util.error(error);
	}
	// return message and payload
	const payload = {
		user: {
			name: user.name,
			username: user.username,
			id: user.id,
			permissions: default_perms,
			action: 'RESET_PERMISSIONS'
		}
	};
	return res.status(200).send({ message: 'Successfully reset permissions for the user', payload: payload });
});

// Get Permissions for User
router.get('/:username/permissions', auth, async (req, res) => {
	if (!util.checkPermission(req.user, 'GET_PERMISSIONS')) return res.status(403).send({ error: 'Please contact an admin to request the needed permission to perform this operation', permission: 'GET_PERMISSIONS' });
	const user = await User.findOne({ username: req.params.username })
	// check if the user is available
	if (!user.username) return res.status(404).send({ error: 'Could not find user!' });
	const payload = {
		user: {
			name: user.name,
			username: user.username,
			id: user.id,
			permissions: user.permissions,
			action: 'GET_PERMISSIONS'
		}
	};
	return res.status(200).send({ payload: payload });
});
module.exports = router;
