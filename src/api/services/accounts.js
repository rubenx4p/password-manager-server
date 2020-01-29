const bcrypt = require('bcryptjs');
const Account = require('../models/account');
const User = require('../models/user');
const CryptoJS = require("crypto-js");
const aes = require('../../utils/aes')
// // Encrypt
// var ciphertext = CryptoJS.AES.encrypt('my message', 'secret key 123');
 
// console.log("!!!!ciphertext!!! = ", ciphertext.toString())

// // Decrypt
// var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), 'secret key 123');
// var plaintext = bytes.toString(CryptoJS.enc.Utf8);
 
// console.log(plaintext);
const getAccounts = async (req, res) => {
    const userId = req.userData.userId;
    const user = await User.findById(userId)
    res.status(200).json({ accounts: user.accounts });
  };

const addAccount = async (req, res) => {
    try {
        const user = await User.findById(req.userData.userId);
        if (!user) {
            return res.status(400).send("Invalid user")
        }
        const { key, password} = req.body
        const validPassword = await bcrypt.compare(key, user.password)
        if (!validPassword) {
            return res.status(400).send("Invalid password")
        }
        const ciphertext = aes.encrypt(password, key)
        const account = new Account({
            name: req.body.name,
            username: req.body.username,
            password: ciphertext
        })
        user.accounts.push(account);
        await user.save();
        res.status(200).json({
            message: "account added successfuly",
            account: { id: account._id, name: account.name}
        })
    } catch (err) {
        return res.status(400).send("Problem with the request")
    }
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
  
const receiveAccountPassword = async (req, res) => {
    try {
        const user = await User.findById(req.userData.userId);
        const account = user.accounts.id(req.params.id)
        const decryptObject = aes.decrypt(account.password, req.body.key)
        if (decryptObject.status === 500) {
            return res.status(500).json({
                message: "the key is inccorect"
              })  
        }
        res.status(200).json({
            message: "received password successfuly",
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
                message: "the key is inccorect"
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
            message: "account edited successfuly"
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