const jwt = require('jsonwebtoken')
const { User } = require('../models/user')

const auth = async (req, res, next) => {

    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const JWT_SECRET = process.env.JWT_SECRET || "angel-manuel-goez"
        const decoded = jwt.verify(token, JWT_SECRET)
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})
        if(!user){
            throw new Error()
        }
        req.token = token
        req.user = user

    } catch (error) {
        return res.status(401).send({error:"Please authenticate"})
    }

    next()
}

module.exports = auth