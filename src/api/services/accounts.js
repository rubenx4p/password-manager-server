const Account = require('../models/account');
const User = require('../models/user');

const getAccounts = async (req, res) => {
    const userId = req.userData.userId;
    const user = await User.findById(userId)
    res.status(200).json({ accounts: user.accounts });
  };

const addAccount = async (req, res) => {
    const user = await User.findById(req.userData.userId);
    const account = new Account({
      name: req.body.name,
      username: req.body.username,
      password: req.body.password
    })
    user.accounts.push(account);
    await user.save();
    res.status(200).json({
      message: "account added successfuly",
      account: { id: account._id, name: account.name}
    })
}
const deleteAccount = async (req, res) => {
    try {
        await Account.deleteOne({ _id: req.userData.userId })
    }
    catch (err) {
        res.status(500).json({
            error: error
          })  
    }
  }
// router.get('/:id/password', auth,  (req, res, next) => {
//   const { id } = req.params;
//   Account.findById(id)
//   .select("password")
//   .exec()
//   .then(doc => {
//     res.status(200).json({password: doc.password})
//   })
//   .catch(err => {
//     console.log(err)
//     res.status(500).json({error: err})
//   })
// });
  
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

module.exports = {
    getAccounts,
    addAccount,
    deleteAccount
};