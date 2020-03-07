const bcrypt = require('bcryptjs');
const Account = require('../models/account');
const User = require('../models/user');
const aes = require('../../utils/aes')
const to = require('../../utils/to')
const getAccounts = async (req, res, next) => {
    // await Promise.reject(new Error('!!!!!!!!!!!!'))
    const userId = req.userData.userId;
    const [user, err] = await to(User.findById(userId))

    if (err) {
        return res.status(400).json({msg: 'User not found'})
    }

    res.status(200).json({ accounts: user.accounts });
  };

const addAccount = async (req, res, next) => {
    const [user, userErr] = await to(User.findById(req.userData.userId))
    
    if (userErr) {
        return res.status(400).json({msg: 'Invalid user'})
    }

    const { key, password} = req.body
    const [validPassword, passwordErr] = await to(bcrypt.compare(key, user.password))
    
    if (!validPassword) {
        return res.status(400).json({msg: 'Invalid password'})
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
        return res.status(500).json({msg: 'Internal error on save'})
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
        return res.status(400).json({msg: 'Invalid user'})
    }

    const { key } = body
    const [validKey, keyErr] = await to(bcrypt.compare(key, user.password))
    if (!validKey) {
        return res.status(400).json({msg: 'Invalid key'})
    }

    const { id } = params
    const [pull, pullErr] = await to(user.accounts.pull(id))

    if (pullErr) {
        return res.status(400).json({msg: 'Wrong account'})
    }

    const [save, saveErr] = await to(user.save())

    if (saveErr) {
        return res.status(400).json({msg: 'Internal error on save'})
    }

    res.status(200).send({msg: 'Account Successfully removed'})
}
  
const receiveAccountPassword = async ({ userData, params, body }, res, next) => {
    const { userId } = userData
    const [user, userErr] = await to(User.findById(userId))

    if (userErr) {
        return res.status(400).json({msg: 'Invalid user'})
    }

    const { key } = body
    const [validKey, keyErr] = await to(bcrypt.compare(key, user.password))

    if (!validKey) {
        return res.status(400).json({msg: 'Invalid key'})
    }

    const { id } = params
    const [account, accountErr] = await to(user.accounts.id(id))

    if (accountErr) {
        return res.status(400).json({msg: 'Invalid account'})
    }
    const decryptObject = aes.decrypt(account.password, key)

    if (decryptObject.status === 500) {
        return res.status(400).json({msg: 'the key is inccorect'})
    }
    res.status(200).json({
        msg: "received password successfuly",
        password: decryptObject.message
    })
}

const editAccount = async ({ userData, params, body }, res, next) => {
    const { userId } = userData
    const [user, userErr] = await to(User.findById(userId))
    
    if (userErr) {
        return res.status(400).json({msg: 'Invalid user'})
    }

    const account = user.accounts.id(params.id)
    const { key } = body
    const decryptObject = aes.decrypt(account.password, key)

    if (decryptObject.status === 500) {
        return res.status(500).json({msg: 'The key is inccorect'})
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
    
    const [save, saveErr] = await to(user.save())

    if (saveErr) {
        return next({msg: 'Internal error on save', status: 400, err: saveErr, func: 'editAccount'})
    }
    const result = {
        account: {
            id: account._id,
            name,
            password: ciphertext,
            username
        },
        msg: "Account edited successfuly"
    }
    res.status(200).json(result)
}

module.exports = {
    getAccounts,
    addAccount,
    deleteAccount,
    receiveAccountPassword,
    editAccount
};