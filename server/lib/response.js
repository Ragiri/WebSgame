const response = new Object

response.handleResponse = (req, res, next) => {

    if (!res.respStatus && !res.response) {
        res.respStatus = 404
        res.errorMsg = 'No response for this endpoint'
        return next(new Error)
    }

    res.status(res.respStatus || 200)

    res.json(res.response || {})

    next()
}

module.exports = response