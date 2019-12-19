const router = require('express').Router();
const mongoose = require('mongoose');
const Account = require('./models/account');

router.get('/', (req, res, next) => {
  Account.find()
  .exec()
  .then(docs => {
    console.log(docs)
    res.status(200).json(docs)
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({error: err})
  })
});

router.post('/', (req, res, next) => {
  const account = new Account({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    password: req.body.password
  })

  account.save()
  .then(result => {
    console.log(result)
    res.status(201).json({
      message: "Handling POST request to /accounts",
      account
    });
  })
  .catch(error => {
    console.log(error)
    res.status(500).json({error: error})
  })
    
  });
router.patch('/:id', (req, res, next) => {
  const { id } = req.params;
  const { body } = req;
  const updateOps = Object.keys(body).reduce((acc, item) => (Object.assign(acc, {[item]: body[item]})), {})

  Account.update({_id: id}, { $set: updateOps })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: error
      })    
  });
})
router.delete('/:id',(req, res, next) => {
  const { id } = req.params;
  console.log(id)
  Account.remove({_id: id})
    .exec()
    .then(result => {
      res.status(200).json(result)
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: error
      })  
    })
})

module.exports = router;