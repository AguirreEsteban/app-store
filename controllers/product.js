const Product = require('../models/product')

const { uploadMultiple, removeFile } = require('../configs/uploadMultipleImage')
const multiUpload = uploadMultiple.fields([{ name: 'images' }]);
exports.store = async (req, res, next) => {
    try {
        multiUpload(req, res, async (err) => {
            console.log(err)
            if (!err) {
                if (!req.files || !req.files.images) {
                    return res.status(400).json({ info: "Error, when add image ", success: false })
                }
                const { images } = req.files
                let imgs = []
                images.forEach(element => {
                    imgs.push(element.location)
                });
                req.body.images = imgs
                const data = new Product(req.body)
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
                }else {
                    const pr = await data.save()
                    if (!pr || !pr._id) {
                        return res.status(400).json({ info: "Error, when add image ", success: false })
                    }
                    return res.status(200).json({ info: "Error, when add image ", success: true, data: pr })
                }
            } else {
              
                return res.status(400).json({ success: false, info: 'Invalid data structure' })
            }
        })
    } catch (error) {
        next(error)
    }
}

exports.getAll = async (req, res, next) => {
    try {
        const {page} = req.params
  
        const options = {
            page: page,
            limit: 2,
            collation: {
            locale: 'en',
            },
        }
        let query ={}
        const {search, subcategory} = req.query
        if(search){
           query.$or = [{name: search, description: search}]
        }else if(subcategory){
            query.subcategory = subcategory
        }
        // if(role === 'admin'){
           
        // }else if(role ==='seller'){
            
        // }else if(role ==='client' || !role){
            
        // }
       
        const products = await Product.paginate(query, options);
        return res.status(200).json({ info:'ok', data: products })
    } catch (error) {
       next(error) 
    }
}