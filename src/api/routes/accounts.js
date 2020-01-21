const router = require('express').Router();
const mongoose = require('mongoose');
const Account = require('../models/account');
const User = require('../models/user');
const { parse } = require('../helpers/accounts')
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res, next) => {
  const userId = req.userData.userId;
  console.log("userId: ", userId)
  const user = await User.findById(userId)
  console.log("user = ", user);
  res.status(200).send({ accounts: user.accounts });
  // Account.find()
  // .select(["_id", "name", "username"])
  // .exec()
  // .then(docs => {
  //   console.log("docs: ", docs)
  //   res.status(200).json(docs.map(doc => ({id: doc._id, name: doc.name, username: doc.username})))
  // })
  // .catch(err => {
  //   console.log(err)
  //   res.status(500).json({error: err})
  // })
});
router.get('/:id/password', auth,  (req, res, next) => {
  const { id } = req.params;
  Account.findById(id)
  .select("password")
  .exec()
  .then(doc => {
    res.status(200).json({password: doc.password})
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({error: err})
  })
});

router.post('/', auth, async (req, res, next) => {
  const userId = req.userData.userId;
  const user = await User.findById(userId);
  const account = new Account({
    name: req.body.name,
    username: req.body.username,
    password: req.body.password
  })
  user.accounts.push(account);
  await user.save();
  res.status(200).send({
    message: "account added successfuly",
    account: { id: account._id, name: account.name}
  })
  // user.accounts.push()
  // const account = new Account({
  //   _id: new mongoose.Types.ObjectId(),
  //   name: req.body.name,
  //   username: req.body.username,
  //   password: req.body.password
  // })

  // account.save()
  // .then(result => {
  //   console.log(result)
  //   res.status(201).json(parse(result));
  // })
  // .catch(error => {
  //   console.log(error)
  //   res.status(500).json({error: error})
  // })
    
  });
router.patch('/:id', auth,  (req, res, next) => {
  const { id } = req.params;
  const { body } = req;
  const updateOps = Object.keys(body).reduce((acc, item) => (Object.assign(acc, {[item]: body[item]})), {})

  Account.update({_id: id}, { $set: updateOps })
    .select(["_id", "name", "username", "password"])
    .exec()
    .then(result => {
      res.status(200).json();
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: error
      })    
  });
})
router.delete('/:id', auth, (req, res, next) => {
  const { id } = req.params;
  console.log(id)
  Account.remove({_id: id})
    .exec()
    .then(result => {
      res.status(200).json()
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: error
      })  
    })
})

module.exports = router;