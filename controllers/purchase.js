const Purchase = require('../models/purchase')

exports.store = async (req, res, next) => {
    try {
        let data = new Purchase(req.body)
        var error = data.validateSync();
        if(error)
        {
            let status = []
            for(const key in error.errors)
            {
                let message = error.errors[key].message
                let res = {
                    field: error.errors[key].path,
                    reason: message.toString().replace(/\\|"/gi,"")
                };
                status.push(res);
            }
            return res.status(400).json({ success: false, info: 'Invalid data structure', data:status})
        } else{
            let status = await data.save();
            if(!('_id' in status)) {
                return res.status(400).json({ success: false, info: 'Fatal Error, unable to purchase, try later'})
            }else {
                return res.status(200).json({ success: true, info: 'purchase saved successfully', data: status})
            }
        }
    } catch (error) {
        next(error)
    }
}

exports.getAll = async (req, res, next) => {
    try {
        const {page} = req.params
        const options = {
            page: page,
            limit: 20,
            collation: {
            locale: 'en',
            },
        }
        const data = await Purchase.paginate({}, options);
        return res.status(200).json({ info:'ok', data: data })
    } catch (error) {
       next(error) 
    }
}


exports.UserPurchase = async (req, res, next) => {
    try {
        const {page} = req.params
        const options = {
            page: page,
            limit: 20,
            collation: {
            locale: 'en',
            },
        }
        let query ={ userId: req.body.id}  
        const data = await Purchase.paginate(query, options);
        return res.status(200).json({ info:'ok', data: data })
    } catch (error) {
       next(error) 
    }
}

exports.update = async (req, res, next) => {
    try {
        const data = await Purchase.findByIdAndUpdate(req.params.id, req.body)
        if(!data || !data._id)
            return res.status(400).json({info:"Error update"})

        return res.status(200).json({info:"ok updated data", data: data})
    } catch (error) {
        next(error)
    }
}
