const router = require('express').Router()

const { catchErrors } = require('../handlers/errorHandler')
const analyticController = require('../controllers/analyticController')

// router.get("/:portfolio_id", catchErrors(analyticController.getAll))
// router.delete("/:analytic_id", catchErrors(analyticController.delete))
// router.get("/:analytic_id", catchErrors(analyticController.findOne))
router.get("/questions", catchErrors(analyticController.fetch))

router.post("/insertcandidate", catchErrors(analyticController.insertcandidate))
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
