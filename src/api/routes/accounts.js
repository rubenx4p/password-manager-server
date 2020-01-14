const router = require('express').Router();
const mongoose = require('mongoose');
const Account = require('../models/account');
const { parse } = require('../helpers/accounts')
const auth = require('../middleware/auth');

router.get('/', auth,  (req, res, next) => {
  Account.find()
  .select(["_id", "name", "username"])
  .exec()
  .then(docs => {
    console.log("docs: ", docs)
    res.status(200).json(docs.map(doc => ({id: doc._id, name: doc.name, username: doc.username})))
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({error: err})
  })
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

router.post('/', auth, (req, res, next) => {
  const account = new Account({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    username: req.body.username,
    password: req.body.password
  })

  account.save()
  .then(result => {
    console.log(result)
    res.status(201).json(parse(result));
  })
  .catch(error => {
    console.log(error)
    res.status(500).json({error: error})
  })
    
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