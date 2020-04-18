const CryptoJS = require("crypto-js")

const encrypt = (message, key) => {
    const cipher = CryptoJS.AES.encrypt(message, key).toString()
    const hash = CryptoJS.HmacSHA512(cipher, key).toString()
    const cipherHash = cipher + hash
    return cipherHash
}

const decrypt = (cipherHash, key) => {
    const hashLength = 128
    const cipher = cipherHash.slice(0, cipherHash.length - hashLength)
    const hash = cipherHash.slice(-128)
    const checkHash = CryptoJS.HmacSHA512(cipher, key).toString()
    if (checkHash !== hash) {
        return undefined
    }
    const bytes  = CryptoJS.AES.decrypt(cipher, key)
    const message = bytes.toString(CryptoJS.enc.Utf8)
    return message

}

module.exports = {
    encrypt,
    decrypt
}