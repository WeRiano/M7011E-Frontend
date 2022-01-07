let cryptoJS = require('crypto-js')

function loadUser() {
    return JSON.parse(localStorage.getItem('currentUser'))
}

function loadToken() {
    let user = loadUser()
    if (user == null) return null
    let enc_token = user["auth_token"]
    let secretPhrase = process.env.REACT_APP_AUTH_TOKEN_SECRET_PHRASE
    return cryptoJS.AES.decrypt(enc_token.toString(), secretPhrase).toString(cryptoJS.enc.Utf8)

}

function storeUser(user, token=null) {
    if (token != null) {
        let secretPhrase = process.env.REACT_APP_AUTH_TOKEN_SECRET_PHRASE
        let encrypted = cryptoJS.AES.encrypt(token, secretPhrase)
        user["auth_token"] = encrypted.toString()
    }
    localStorage.setItem('currentUser', JSON.stringify(user))
}

export { loadUser, storeUser, loadToken }