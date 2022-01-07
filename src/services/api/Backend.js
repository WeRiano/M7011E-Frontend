import { handleFetchError } from "./ErrorHandling";

let backendBaseUrl = "http://127.0.0.1:7999/api/version/1/"

function requestCreateUser(user) {
    let url = backendBaseUrl + "users/"

    let body = {
        first_name: user.first_name,
        last_name: user.last_name,
        address: user.address,
        city: user.city,
        zip_code: user.zip_code,
        email: user.email,
        password: user.password,
        re_password: user.confirm_password
    }

    let inputErr = false

    return fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    }).then(handleFetchError).then(res => {
        if (res.status === 400) {
            inputErr = true
        }
        return res.json()
    }).then((data) => {
        return (inputErr) ? [false, data] : [true, data]
    }).catch(error => {
        console.error(error)
        return [false, null]
    })
}

function requestCreateAuthToken(email, password) {
    // TODO: Don't hardcode location for backend server
    let url = backendBaseUrl + "token/login/"

    let body = {
        email: email,
        password: password
        // other information fetched from database
    }

    let inputErr = false
    return fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    }).then(handleFetchError).then(res => {
        if (res.status === 400) {
            inputErr = true
        }
        return res.json()
    }).then((data) => {
        return (inputErr) ? [false, data] : [true, data]
    }).catch((error) => {
        console.error(error)
        return [false, null]
    })
}

function requestDestroyAuthToken(auth_token) {
    // TODO: Don't hardcode location for backend server
    let url = backendBaseUrl + "token/logout/"

    return fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Token " + auth_token
        }
    }).then(handleFetchError).then(() => {
        return [true, null]
    }).catch((error) => {
        console.error(error)
        return [false, null]
    })
}

function requestUserInfo(auth_token) {
    // TODO: Don't hardcode location for backend server
    let url = backendBaseUrl + "users/me/"

    return fetch(url, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Token " + auth_token
        }
    }).then(handleFetchError).then(res => res.json()).then((data) => {
        return [true, data]
    }).catch((error) => {
        console.error(error)
        return [false, null]
    })
}

function requestEditUserPassword(newPassword, confirmNewPassword, currentPassword, auth_token) {
    // TODO: Don't hardcode location for backend server
    let url = backendBaseUrl + "users/set_password/"

    let inputErr = false
    return fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Token " + auth_token
        },
        body: JSON.stringify({
            new_password: newPassword,
            re_new_password: confirmNewPassword,
            current_password: currentPassword
        })
    }).then(handleFetchError).then(res => {
        if (res.status === 400) {
            inputErr = true
        }
        if(res.status === 204) {
            return {}
        }
        return res.json()
    }).then((data) => {
        return (inputErr) ? [false, data] : [true, data]
    }).catch((error) => {
        console.error(error)
        return [false, null]
    })
}

function requestEditUserInfo(user, auth_token) {
    // TODO: Don't hardcode location for backend server
    let url = backendBaseUrl + "users/update_profile/"

    let inputErr = false
    return fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Token " + auth_token
        },
        body: JSON.stringify({
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            address: user.address,
            city: user.city,
            zip_code: user.zip_code,
        })
    }).then(handleFetchError).then(res => {
        if (res.status === 400) {
            inputErr = true
        }
        return res.json()
    }).then((data) => {
        return (inputErr) ? [false, data] : [true, data]
    }).catch((error) => {
        console.error(error)
        return [false, null]
    })
}

function requestGetUserImage(auth_token) {
    let url = backendBaseUrl + "users/get_image/"

    return fetch(url, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Token " + auth_token
        }
    }).then(handleFetchError).then(res => res.blob()).then((blob) => {
        const imageObjectURL = URL.createObjectURL(blob);
        return [true, imageObjectURL]
    }).catch((error) => {
        console.error(error)
        return [false, null]
    })
}

function requestEditUserImage(img, imgType, auth_token) {
    // TODO: Don't hardcode location for backend server
    let url = backendBaseUrl + "users/update_image/"

    return fetch(url, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Token " + auth_token
        },
        body: JSON.stringify({
            file: img.substring(img.indexOf(",") + 1),
            type: imgType
        })
    }).then(handleFetchError).then(() => {
        return [true, null]
    }).catch((error) => {
        console.error(error)
        return [false, null]
    })
}

export { requestCreateAuthToken, requestDestroyAuthToken, requestUserInfo, requestEditUserInfo,
         requestEditUserPassword, requestEditUserImage, requestGetUserImage, requestCreateUser };