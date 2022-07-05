const router = require('express').Router()
const auth = require('../middlewares/auth')

const { catchErrors } = require('./../handlers/errorHandler')
const userContoller = require('../controllers/userController')
router.post("/login", catchErrors(userContoller.login))
router.get("/logout", catchErrors(userContoller.logout))
router.post("/register", catchErrors(userContoller.register))
router.get("/getuserdetails", catchErrors(userContoller.getuserdetails))



// router.post("/validation", auth, catchErrors(userContoller.login))

module.exports = router
