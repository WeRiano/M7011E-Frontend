import { handleFetchError } from "./ErrorHandling";

let simulationPort = 8000;
let simulationIP = process.env.REACT_APP_SIMULATION_IP
let simulationBaseUrl = "http://" + simulationIP + "/api/version/1/"

function requestGetSimCond(auth_token) {
    let url = simulationBaseUrl + "get_current_conditions/all/"

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

function requestEditDelta(delta, auth_token) {
    let url = simulationBaseUrl + "set_update_frequency/" + delta + "/"

    let inputErr = false
    return fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Token " + auth_token
        }
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

function requestEditBufferSettings(storing, using, auth_token) {
    let url = simulationBaseUrl + "set_buffer_settings/"
    url += storing + "/"
    url += using + "/"

    return fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Token " + auth_token
        }
    }).then(handleFetchError).then(res => {
        return [true, null]
    }).catch((error) => {
        console.error(error)
        return [false, null]
    })
}

export { requestGetSimCond, requestEditDelta, requestEditBufferSettings };
