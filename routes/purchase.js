const {Router} = require('express')
const router = Router()
const controller = require('../controllers/purchase')

router
    .route('/list/:page')
    .get(controller.getAll)
    .post(controller.store)

router
    .route('/list-user/:page')
    .get(controller.UserPurchase)

router
    .route('/update/:id')
    .put(controller.updatePurchase)


module.exports = router