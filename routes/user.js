const router = require('express').Router()
const auth = require('../middlewares/auth')

const { catchErrors } = require('./../handlers/errorHandler')
const userContoller = require('../controllers/userController')
router.post("/login", catchErrors(userContoller.login))
router.get("/logout", catchErrors(userContoller.logout))
router.post("/register", catchErrors(userContoller.register))
router.get("/getuserdetails", catchErrors(userContoller.getuserdetails))
router.put("/editpassword/:userid", catchErrors(userContoller.editpassword))
router.delete("/deleteuser/:userid", catchErrors(userContoller.deleteuser))
router.post("/createcompany", catchErrors(userContoller.createcompany))
router.get("/getcompdetails", catchErrors(userContoller.getcompdetails))
router.post("/addcategory", catchErrors(userContoller.addcategory))

// router.post("/validation", auth, catchErrors(userContoller.login))

module.exports = router
