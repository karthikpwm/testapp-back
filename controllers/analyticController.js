const analytic = require('./../models/analytic')
const nodemailer = require("nodemailer");

exports.getAll = async (req, res) => {
  if (Object.keys(req.params).length === 0 && req.params.portfolio_id === undefined) {
    throw '400:Parameter not Valid'
  }
  let total = await analytic.totalWeightage(req.params.portfolio_id);
  let result = await analytic.getAll(req.params.portfolio_id)
  res.json({ total: total, data: result })
};

exports.getmarks = async (req, res) => {
  let data = await analytic.getmarks();

  res.json({ data: data })
};
exports.getcandidateqstnmarks = async (req, res) => {
  let data = await analytic.getcandidateqstnmarks();

  res.json({ data: data })
};
exports.fetch = async (req, res) => {
  //let total = await analytic.totalWe(); 
  let result = await analytic.fetch(req.body.testlog_id, req.body.candidate_id)
  res.json({ data: result })
};

exports.insertcandidate = async (req, res) => {
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    throw '400:Parameter not Valid'
  }

  const result = await analytic.insertcandidate(req.body)
  res.json({
    message: `candidate inserted successfully`,
    insert_id: result
  })
};




// async..await is not allowed in global scope, must use a wrapper
exports.mail = async (res, req) => {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  //let testAccount = await nodemailer.createTestAccount();
  //console.log('work')
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'karthik@pwm-india.com', // generated ethereal user
      pass: 'karthik29410665', // generated ethereal password
    },
    debug: true, // show debug output
    logger: true
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"kk" <karthik@pwm-india.com>', // sender address
    to: "karthik2768@gmail.com", // list of receivers
    subject: "Hello", // Subject line
    text: "kjbjkhgbjb ugkbkj", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}


// exports.upexcel = async (req, res) => {
//   if(req.body.constructor === Object && Object.keys(req.body).length === 0){
//     throw '400:Parameter not Valid'
//   }

//   const result = await analytic.insert( req.body )
//   res.json({
//     message: `analytic insert successfully`,
//     insert_id : result
//   })
// };

exports.delete = async (req, res) => {
  if (Object.keys(req.params).length === 0 && req.params.analytic_id === undefined) {
    throw '400:Parameter not Valid'
  }

  const result = await analytic.delete(req.params)
  res.json({
    message: 'record delete successfully'
  })

};

exports.deletecan = async (req, res) => {
  // if (Object.keys(req.params).length === 0 && req.param === undefined) {
  //   throw '400:Parameter not Valid'
  // }

  const result = await analytic.deletecan(req.params)
  res.json({
    message: 'record delete successfully'
  })

};
// exports.uploadRecord = async (req,res) => {

//   const result = await analytic.uploadRecord()
//     res.json({
//       message: `analytic updated successfully`,
//     })
// }

exports.postUploadRecord = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    throw '400:Parameter not Valid'
  }
  const result = await analytic.postUploadRecord(req.body)
  res.json({
    message: `analytic updated successfully`,
  })
}

exports.upload = async (req, res) => {
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    throw '400:Parameter not Valid'
  }
  const result = await analytic.upload(req.body)
  res.json({
    message: `analytic updated successfully`,
    insert_id: result
  })
}

exports.uploadnse = async (req, res) => {
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    throw '400:Parameter not Valid'
  }
  const result = await analytic.uploadnse(req.body)
  res.json({
    message: `analytic updated successfully`,
    insert_id: result
  })
}

exports.updateRecord = async (req, res) => {
  if (Object.keys(req.params).length === 0 && req.params.analytic_id === undefined) {
    throw '400:Parameter not Valid'
  }
  const result = await analytic.updateRecord(req.params.analytic_id, req.body)
  res.json({
    message: `analytic updated successfully`,
  })

}

exports.starttest = async (req, res) => {
  if (Object.keys(req.body).length === 0 && req.body.candidate_id === undefined) {
    throw '400:Parameter not Valid'
  }
  const result = await analytic.starttest(req.body.candidate_id)
  res.json({
    message: `analytic updated successfully`,
    'check': 1,
    testlog_id: result
  })

}

exports.answertest = async (req, res) => {
  if (Object.keys(req.body).length === 0 && req.body.candidate_id === undefined) {
    throw '400:Parameter not Valid'
  }
  const result = await analytic.answertest(req.body.testlog_id, req.body.candidate_id, req.body.userAnswers)
  res.json({
    message: `analytic updated successfully`,
  })

}
// exports.update = async (req,res) => {
//   if(req.body.constructor === Object && Object.keys(req.body).length === 0){
//     throw '400:Parameter not Valid'
//   }
//   const result = await analytic.update( req.body )
//     res.json({
//       message: `analytic updated successfully`,
//       insert_id : result
//     })
// }
