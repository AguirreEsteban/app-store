const {Router}= require('express')

const router = Router()
const controller =  require('../controllers/user')

//authorize(ADMIN),
router
    .route('/list/:page')
    .get(controller.getAll)
    
router
    .route('/details/:id')
    .get(controller.userData)

router
    .route('/profile-data/')
    .get(controller.getUser)

router
    .route('/forgot-password')
    .post(controller.forgotPassword)

router
    .route('/reset-password')
    .post(controller.resetPassword)

router
    .route('/:id')
    .put(controller.userUpdate)
    
router
    .route('/delete/:id')
    .put(controller.deleteUser)

router
    .route('/create')
    .post(controller.store)

router
    .route('/one/:user')
    .get(controller.getOne)


router
    .route('/auth')
    .post(controller.login)


module.exports = router