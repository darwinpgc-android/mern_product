// controller for routes , to export functions

const User = require('../models/user')

exports.getUserById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => { // callback in databse function always returns 2 things, " error and object "
        if(err || !user){
            return res.status(400).json({
                error: 'no user was found'
            })
        }

        req.profile = user
        next()
    })
}  

exports.getUser = (req, res, next) => {
    // get back here for password 
    return res.json(req.profile)
}