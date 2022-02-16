const {Router} = require('express')
const router = Router()
const controller = require('../controllers/categotyAndSubcategory')

router
    .route('/category')
    .get(controller.getAllC)
    .post(controller.storeC)

router
    .route('/subcategory')
    .get(controller.getAllS)
    .post(controller.storeS)

module.exports = router