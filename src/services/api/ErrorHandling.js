function handleFetchError(response) {
    if (!response.ok && response.status !== 400) {
        throw Error(response.statusText)
    }
    return response;
}

export { handleFetchError }