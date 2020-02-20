const bcrypt = require('bcryptjs');
const Account = require('../models/account');
const User = require('../models/user');
const aes = require('../../utils/aes')
const to = require('../../utils/to')

const getAccounts = async (req, res) => {
    const userId = req.userData.userId;
    const [user, err] = await to(User.findById(userId))

    if (err) {
        return res.status(400).send({msg: "User not found"})
    }
    res.status(200).json({ accounts: user.accounts });
  };

const addAccount = async (req, res) => {
        const [user, userErr] = await to(User.findById(req.userData.userId))
        if (userErr) {
            return res.status(400).send({msg: "Invalid user"})
        }
        const { key, password} = req.body
        const [validPassword, passwordErr] = await to(bcrypt.compare(key, user.password))
        if (!validPassword) {
            return res.status(400).send({msg: "Invalid password"})
        }
        const ciphertext = aes.encrypt(password, key)
        const account = new Account({
            name: req.body.name,
            username: req.body.username,
            password: ciphertext
        })
        user.accounts.push(account);
        const [save, saveErr] = await to(user.save())
        if (saveErr) {
            return res.status(500).send({msg: "Internal error on save"})
        }
        res.status(200).json({
            msg: "Account added successfuly",
            account: { id: account._id, name: account.name}
        })
}
const deleteAccount = async ({ userData, params, body }, res) => {
    const { userId } = userData
    const [user, userErr] = await to(User.findById(userId))

    if (userErr) {
        return res.status(400).send({msg: "Invalid user"})
    }

    const { key } = body
    const [validKey, keyErr] = await to(bcrypt.compare(key, user.password))
    if (!validKey) {
        return res.status(400).send({ msg: "Invalid key"})
    }

    const { id } = params
    const [pull, pullErr] = await to(user.accounts.pull(id))

    if (pullErr) {
        return res.status(400).send({msg: "Wrong account"})
    }

    const [save, saveErr] = await to(user.save())

    if (saveErr) {
        return res.status(400).send({msg: "Internal error on save"})
    }

    res.status(200).send({msg: 'Account Successfully removed'})
}
  
const receiveAccountPassword = async (req, res) => {
    try {
        const user = await User.findById(req.userData.userId);
        const account = user.accounts.id(req.params.id)
        const decryptObject = aes.decrypt(account.password, req.body.key)
        if (decryptObject.status === 500) {
            return res.status(500).json({
                msg: "the key is inccorect"
              })  
        }
        res.status(200).json({
            msg: "received password successfuly",
            password: decryptObject.message
        })
        // account = await user.accounts.findById(req.params.id)
    }
    catch (err) {
        res.status(500).json({
            error: err
        })  
    }
}

const editAccount = async (req, res) => {
    try {
        const user = await User.findById(req.userData.userId);
        const account = user.accounts.id(req.params.id)
        const { key } = req.body
        const decryptObject = aes.decrypt(account.password, req.body.key)
        if (decryptObject.status === 500) {
            return res.status(500).json({
                msg: "the key is inccorect"
              })  
        }
        const {
            password = decryptObject.message,
            name = account.name,
            username = account.username
        } = req.body
        const ciphertext = aes.encrypt(password, key)
        account.set({
            name,
            username,
            password: ciphertext
        })
        await user.save()
        const result = {
            account: {
                id: account._id,
                name,
                password: ciphertext,
                username
            },
            msg: "account edited successfuly"
        }
        res.status(200).json(result)
    }
    catch (err) {
        res.status(500).json({
            error: err
        })  
    }
  
    
}

module.exports = {
    getAccounts,
    addAccount,
    deleteAccount,
    receiveAccountPassword,
    editAccount
};