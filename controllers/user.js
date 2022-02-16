const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../configs/vars')
const path = require('path')
exports.store = async (req, res, next) => {
    try {

        let data = new User(req.body)
        var error = data.validateSync();
        if (error) {
            let status = []
            for (const key in error.errors) {
                let message = error.errors[key].message
                let res = {
                    field: error.errors[key].path,
                    reason: message.toString().replace(/\\|"/gi, "")
                };
                status.push(res);
            }
            return res.status(400).json({ success: false, info: 'Invalid data structure', data: status })
        } else {
            let status = await data.save();
            if (!('_id' in status)) {
                return res.status(400).json({ success: false, info: 'Fatal Error, unable to store User, try later' })
            } else {
                return res.status(200).json({ success: true, info: 'User saved successfully', data: status })
            }
        }

    } catch (error) {
        next(error)
    }

}
exports.getUser = async (req, res, next) => {
    try {
        const data = await User.findById("60901724e8ce8e328ab7fefd", { password: 0, _v: 0, role: 0 }).populate({ path: "store", model: "Store" })
        if (!data || !data._id)
            return res.status(400).json({ success: false, info: "User not found" })
        return res.status(200).json({ success: true, info: "User found", data })
    } catch (error) {
        next(error)
    }
}



exports.userData = async (req, res, next) => {
    try {
        const { id } = req.params
        const data = await User.findOne({ _id: id })
        if (!data || !data._id)
            return res.status(400).json({ success: false, info: "User not found" })
        return res.status(200).json({ success: true, info: "User found", data })

    } catch (error) {
        console.log(error)
        next(error)
    }
}
exports.userUpdate = async (req, res, next) => {
    try {
       

        const { id } = req.params
        const data = await User.findByIdAndUpdate(id, req.body, { new: true })
        if (!data || !data._id)
            return res.status(400).json({ success: false, info: "User not found" })

        let html = pug.renderFile(path.join(process.cwd(), 'emails', 'activeAccount.pug'), { name: data.firstName, lastname: data.firstLastname, url: 'http://localhost:3000' })
        Email(data.email, 'Cuenta activada', html)
        return res.status(200).json({ success: true, info: "User found", data })
    } catch (error) {
        next(error)
    }
}

exports.getOne = async (req, res, next) => {
    try {
        const { user } = req.params
        if (!user || !Types.ObjectId.isValid(user))
            return res.status(400).json({ success: false, info: 'invalid data structure' })
        const data = await User.findById(user)
        return res.status(200).json({ success: true, info: 'Ok', data: data })
    } catch (error) {
        next(error)
    }
}
exports.getAll = async (req, res, next) => {
    try {
        const { page } = req.params
        const { search } = req.query
        let query = {}
        if (search) {
            query = { $or: [{ role: "seller" }, { role: "client" }, { name: search }, { email: search }] }
        } else {
            query = { $or: [{ role: "seller" }, { role: "client" }] }
        }
        const options = {
            page: page,
            limit: 20,
            // collation: {
            // locale: 'en',
            // },
            // sort: {
            //     createdAt: 1 
            // }
        }

        const data = await User.paginate(query, options)
        return res.status(200).json({ success: true, info: "Query do it successfully", data })
    } catch (error) {
        next(error)
    }
}

exports.login = async (req, res, next) => {
    try {
        const resp = await User.validaterUser(req.body);
        if (resp == null)
            return res.status(400).json({ success: false, info: "Credentials not found" })
        else if (!resp.success)
            return res.status(400).json(resp)
        const { user, token } = resp
        return res.status(200).json({ success: true, token, user });
    } catch (error) {
        return next(error);
    }
}
exports.deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params
        const data = await User.findByIdAndUpdate(id, { state: false })
        if (!data || !data._id)
            return res.status(400).json({ success: false, info: "Error update User" })

        return res.status(200).json({ success: true, info: "Successful update" })
    } catch (error) {
        next(error)
    }
}


exports.forgotPassword = async (req, res, next) => {
    try {
        console.log(req.body)
        const { email } = req.body
        const data = await User.findOne({ email: email })
        if (!data || !data._id)
            return res.status(400).json({ success: false, info: "Email no exist" })
        let token = jwt.sign(
            { id: data._id },
            jwtSecret
        );
        let html = pug.renderFile(path.join(process.cwd(), 'emails', 'forgotPassword.pug'), { url: 'http://localhost:8080/user/reset-password?token=' + token })
        Email(email, "Cambiar Contraseña", html)
        return res.status(200).json({ success: true, info: "OK, send Email" })
    } catch (error) {
        next(error)
    }
}
exports.resetPassword = async (req, res, next) => {
    try {
        const { password, token } = req.body
        const decodedToken = jwt.verify(token, jwtSecret);
        const data = await User.findById(decodedToken.id)
        data.password = password
        data.save()
        if (!data || !data._id)
            return res.status(400).json({ success: false, info: "Error update error" })
        return res.status(200).json({ success: true, info: 'ok successfully' })
    } catch (error) {
        next(error)
    }
}