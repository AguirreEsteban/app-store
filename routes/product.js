const {Router} = require('express')
const router = Router()
const controller = require('../controllers/product')

router
    .route('/list/:page')
    .get(controller.getAll)
router
    .route('/')
    .post(controller.store)




module.exports = router