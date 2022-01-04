let cryptoJS = require('crypto-js')

function loadUser() {
    return JSON.parse(localStorage.getItem('currentUser'))
}

function loadToken() {
    let user = loadUser()
    if (user == null) return null
    let enc_token = user["auth_token"]
    return cryptoJS.AES.decrypt(enc_token.toString(),
        process.env.REACT_APP_AUTH_TOKEN_SECRET_KEY).toString(cryptoJS.enc.Utf8)

}

function storeUser(user, token=null) {
    if (token != null) {
        let encrypted = cryptoJS.AES.encrypt(token, process.env.REACT_APP_AUTH_TOKEN_SECRET_KEY)
        user["auth_token"] = encrypted.toString()
    }
    localStorage.setItem('currentUser', JSON.stringify(user))
}

export { loadUser, storeUser, loadToken }