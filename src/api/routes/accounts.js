const router = require('express').Router();
const Account = require('../models/account');
const auth = require('../middleware/auth');
const accountService = require('../services/accounts')

router.get('/', auth, accountService.getAccounts);
router.post('/', auth, accountService.addAccount);
router.delete('/:id', auth, accountService.deleteAccount)
router.post('/:id', auth, accountService.receiveAccountPassword)
router.patch('/:id', auth, accountService.editAccount)

router.get('/password', auth,  (req, res, next) => {
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
  
// router.patch('/:id', auth,  (req, res, next) => {
//   const { id } = req.params;
//   const { body } = req;
//   const updateOps = Object.keys(body).reduce((acc, item) => (Object.assign(acc, {[item]: body[item]})), {})

//   Account.update({_id: id}, { $set: updateOps })
//     .select(["_id", "name", "username", "password"])
//     .exec()
//     .then(result => {
//       res.status(200).json();
//     })
//     .catch(error => {
//       console.log(error);
//       res.status(500).json({
//         error: error
//       })    
//   });
// })


module.exports = router;