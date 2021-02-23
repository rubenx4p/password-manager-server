const router = require('express').Router()
const Account = require('../models/account')
const auth = require('../middleware/auth')
const addAccountSchema = require('../schemas/accounts/addAccount')
const deleteAccountSchema = require('../schemas/accounts/deleteAccount')
const receiveAccountPasswordSchema = require('../schemas/accounts/receiveAccountPassword')
const editAccountSchema = require('../schemas/accounts/editAccount')
const accountService = require('../services/accounts')

router.get('/', auth, accountService.getAccounts)
router.post('/', auth, addAccountSchema, accountService.addAccount)
router.post('/unlockAll', auth, accountService.receiveAllPasswordAccounts)
router.delete('/:id', auth, deleteAccountSchema, accountService.deleteAccount)
router.post('/:id', auth, receiveAccountPasswordSchema, accountService.receiveAccountPassword)
router.patch('/:id', auth, editAccountSchema, accountService.editAccount)

module.exports = router