const jwt = require('jsonwebtoken')
const _ = require('lodash')
const authenticate = (req, res, next) => {
    let token = req.headers['authorization']
    if (!token) {
        return res.status(401).json({ errors: 'authentication failed' })
    }
    try {
        const tokenData = jwt.verify(token, process.env.JWT_SECRET)
        req.user = _.pick(tokenData, ['id', 'role'])
        next()
    } catch (e) {
        res.status(401).json({ errors: 'authentication failed' })
    }
}
module.exports = {
    authenticate
}