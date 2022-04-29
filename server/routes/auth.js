const e = require('express');
const express = require('express');
const req = require('express/lib/request');

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /users.
const userRoutes = express.Router();

// This will help us connect to the database
const dbo = require('../db/conn');

// This section will help you get a list of all the users.
userRoutes.route('/login').post(async function (req, res) {
  const dbConnect = dbo.getDb();

  console.log(req.body.username)
  const user = await dbConnect
    .collection('users')
    .findOne({ username: req.body.username });

  console.log(user)

  if (user != null) {
    console.log('Found user: ', user.username)
    if (user.password === req.body.password) {
      console.log('Successful login!')
      res.status(200).json({
        message: 'Successful login!',
        username: user.username,
        token: 'token'
      });
    } else {
      console.log('Invalid password!')
      res.status(401).json({
        message: 'Invalid password!'
      });
    }
  } else {
    console.log('Username does not exist!');
    res.status(401).send('Username does not exist!')
  }

});

// This section will help you get a list of all the users.
userRoutes.route('/users').get(async function (_req, res) {
  const dbConnect = dbo.getDb();

  dbConnect
    .collection('users')
    .find({})
    .limit(50)
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send('Error fetching users!');
      } else {
        res.json(result);
      }
    });
});

// This section will help you create a new user.
userRoutes.route('/user').post(function (req, res) {
  const dbConnect = dbo.getDb();
  const userDocument = {
    username: req.body.username,
    password: req.body.password,
    last_modified: new Date()
  };

  dbConnect
    .collection('users')
    .insertOne(userDocument, function (err, result) {
      if (err) {
        res.status(400).send('Error inserting user!');
      } else {
        console.log(`Added a new user with id ${result.insertedId}`);
        res.status(200).json({ id: result.insertedId, username: req.body.username });
      }
    });
});

// This section will help you update a record by id.
userRoutes.route('/users/update').post(function (req, res) {
  const dbConnect = dbo.getDb();
  const listingQuery = { username: req.body.username };
  const updates = {
    $set: {
      password: req.body.password,
    },
  };

  dbConnect
    .collection('users')
    .updateOne(listingQuery, updates, function (err, _result) {
      if (err) {
        res
          .status(400)
          .send(`Error updating user on listing with id ${listingQuery.id}!`);
      } else {
        console.log('1 document updated');
      }
    });
});

// This section will help you delete a record.
userRoutes.route('/user/:id').delete((req, res) => {
  const dbConnect = dbo.getDb();
  const listingQuery = { listing_id: req.body.id };

  dbConnect
    .collection('users')
    .deleteOne(listingQuery, function (err, _result) {
      if (err) {
        res
          .status(400)
          .send(`Error deleting user with id ${listingQuery.listing_id}!`);
      } else {
        console.log('1 document deleted');
      }
    });
});

module.exports = userRoutes;
