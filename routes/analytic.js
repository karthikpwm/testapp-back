const router = require('express').Router()
const auth = require('../middlewares/auth')

const { catchErrors } = require('../handlers/errorHandler')
const analyticController = require('../controllers/analyticController')

// router.get("/:portfolio_id", catchErrors(analyticController.getAll))
// router.delete("/:analytic_id", catchErrors(analyticController.delete))
// router.get("/:analytic_id", catchErrors(analyticController.findOne))
router.post("/questions", auth, catchErrors(analyticController.fetch))
router.get("/getmarks", catchErrors(analyticController.getmarks))
router.post("/insertcandidate", auth, catchErrors(analyticController.insertcandidate))
router.post("/mail", catchErrors(analyticController.mail))
router.post("/start_test", auth, catchErrors(analyticController.starttest))
router.post("/answer_test", auth, catchErrors(analyticController.answertest))
//router.get("/uploadRecord", catchErrors(analyticController.uploadRecord))
// router.post("/uploadRecord", catchErrors(analyticController.postUploadRecord))
// router.put("/:analytic_id", catchErrors(analyticController.updateRecord))
// router.post("/upload", catchErrors(analyticController.upload))
// router.post("/uploadnse", catchErrors(analyticController.uploadnse))
//router.post("/upexcel", catchErrors(analyticController.upexcel))
//router.put("/update", catchErrors(analyticController.update))
// router.put("/:analytic_id", catchErrors(analyticController.updateRecord))

// router.delete("/:analytic_id", catchErrors(analyticController.deleteRecord))

module.exports = router
