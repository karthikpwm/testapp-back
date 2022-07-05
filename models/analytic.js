const { db } = require('../config/config')
const nodemailer = require("nodemailer");

exports.starttest = async (candidate_id, company_id) => {
  const con = await db.getConnection()
  try {
    await con.beginTransaction();
    const result = await con.query("select testlog_id from candidatetestlog where candidate_id = ? limit 1",
      [candidate_id])
    const testlog_id = result[0][0].testlog_id
    await con.commit();
    await con.beginTransaction();
    await con.query("UPDATE candidatetestlog SET test = ?, attenddate = now() WHERE testlog_id = ? ",
      [1, testlog_id])
    await con.commit();
    await con.beginTransaction();
    await con.query("insert into candidatetestdata (testlog_id,candidate_id,question_id,answer,createddate) select ?,?,question_id,?,now() from questions where company_id = ? order by question_id desc limit 20",
      [testlog_id, candidate_id, null, company_id])
    //await con.query("SELECT * from candidatetestdata inner join questions ON questions.question_id = candidatetestdata.question_id where testlog_id = ?,candidate_id = ?",
    //[testlog_id, candidate_id, NULL])
    await con.commit();
    //console.log(testlog_id)
    return testlog_id;

  } catch (err) {
    await con.rollback();
    throw err;
  } finally {
    con.close()
  }
}
exports.deletecan = async () => {
  try {
    let sql = `truncate table candidatetestdata `;
    const result = await db.query(sql)
    return true;
  } catch (e) {
    throw e
  }
}

exports.answertest = async (testlog_id, candidate_id, userAnswers, timepassed) => {
  const con = await db.getConnection()
  try {

    await con.beginTransaction();
    let getUserAnswers = []
    for (const [key, value] of Object.entries(userAnswers)) {
      await con.query("update candidatetestdata set answer = ? where testlog_id = ? and candidate_id = ? and question_id = ?",
        [value, testlog_id, candidate_id, key])
    }
    await con.commit();

    await con.beginTransaction();
    await con.query("UPDATE candidatetestlog SET timepassed = ? where testlog_id = ?", [
      timepassed, testlog_id
    ])
    await con.commit();
    return 1;

  } catch (err) {
    await con.rollback();
    throw err;
  } finally {
    con.close()
  }
}
exports.getmarks = async () => {
  try {
    // let sql = `SELECT sum(IF(candidatetestdata.answer=questions.answer, "1", "0")) as totalcorrect,candidatedetails.name as name,candidatedetails.email as email,
    // candidatedetails.mobile as mobile,candidatedetails.candidate_id as candidate_id,candidatedetails.company_id as company_id,candidatedetails.position as position,candidatetestdata.createddate as date,candidatetestlog.timepassed as time
    //     from candidatetestdata inner join candidatedetails on candidatedetails.candidate_id = candidatetestdata.candidate_id INNER JOIN questions on questions.question_id=candidatetestdata.question_id INNER JOIN candidatetestlog on candidatedetails.candidate_id = candidatetestlog.candidate_id
    //  GROUP BY candidatetestdata.candidate_id`;
    let sql = `SELECT sum(IF(candidatetestdata.answer=questions.answer, "1", "0")) as totalcorrect,any_value(candidatedetails.name) as name,any_value(candidatedetails.email) as email,
     any_value(candidatedetails.mobile) as mobile,any_value(candidatedetails.candidate_id) as candidate_id,any_value(candidatedetails.company_id) as company_id,any_value(candidatedetails.position) as position,any_value(candidatetestdata.createddate) as date,any_value(candidatetestlog.timepassed) as time
         from candidatetestdata inner join candidatedetails on candidatedetails.candidate_id = candidatetestdata.candidate_id INNER JOIN questions on questions.question_id=candidatetestdata.question_id INNER JOIN candidatetestlog on candidatedetails.candidate_id = candidatetestlog.candidate_id
      GROUP BY candidatetestdata.candidate_id`;
    const result = await db.query(sql)
    return result[0];
  } catch (e) {
    throw e
  }
}
exports.getallqstns = async () => {
  try {
    let sql = `SELECT * from questions`;
    const result = await db.query(sql)
    return result[0];
  } catch (e) {
    throw e
  }
}

exports.printcanquestions = async (candidate_id) => {
  try {
    let sql = `SELECT IF(candidatetestdata.answer=questions.answer, "1", "0") as correct, candidatetestdata.*,questions.*, candidatetestdata.answer as candidateanswer,candidatedetails.name as candidatename from candidatetestdata
    inner join questions on questions.question_id = candidatetestdata.question_id and candidatetestdata.candidate_id = ? INNER JOIN candidatedetails ON candidatedetails.candidate_id = candidatetestdata.candidate_id and candidatetestdata.answer IS NOT NULL`;
    const result = await db.query(sql, [candidate_id])
    return result[0];
  } catch (e) {
    throw e
  }
}

exports.getcandidateqstnmarks = async (candidate_id) => {
  try {
    let sql = `SELECT sum(IF(candidatetestdata.answer=questions.answer, "1", "0")) as totalcorrect,any_value(candidatedetails.name) as name,any_value(candidatedetails.email) as email,any_value(candidatedetails.position) as position,
    any_value(candidatedetails.mobile) as mobile,any_value(candidatedetails.candidate_id) as candidate_id,any_value(candidatedetails.company_id) as company_id,any_value(candidatedetails.position) as position,any_value(candidatetestdata.createddate) as date,any_value(candidatetestlog.timepassed) as time
        from candidatetestdata inner join candidatedetails on candidatedetails.candidate_id = candidatetestdata.candidate_id INNER JOIN questions on questions.question_id=candidatetestdata.question_id INNER JOIN candidatetestlog on candidatedetails.candidate_id = candidatetestlog.candidate_id AND candidatedetails.candidate_id = ?
     GROUP BY candidatetestdata.candidate_id`;
    const result = await db.query(sql, [candidate_id])
    console.log(result[0][0]['name'])
    const name = result[0][0]['name']
    //const companyname = result[0][0]['companyname']
    if (result[0][0]['company_id'] === 1) {
      var companyname = 'PWM'
    } else {
      var companyname = 'sakthi'
    }
    const mark = result[0][0]['totalcorrect']
    const position = result[0][0]['position']
    const mobile = result[0][0]['mobile']
    const email = result[0][0]['email']
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'karthik@pwm-india.com', // generated ethereal user
        pass: 'swltvwnwpukasygb', // generated ethereal password
      },
      debug: true, // show debug output
      logger: true
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '<karthik@pwm-india.com>', // sender address "kk"
      to: "hre@indtextile.in,", // list of receivers  + email
      subject: "Candidate " + name + "  Result", // Subject line
      text: "Marks Scored out of 10", // plain text body
      html: "<b>Candidate Name :" + name + ",<br/> Applied for:" + companyname + ",<br/> Marks :" + mark + "<br/>Applied Position :" + position + ",<br/>Mobile :" + mobile + "</b>", // html body
    });

    //console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    return result[0];
  } catch (e) {
    throw e
  }
}

// exports.getAll = async (portfolio_id) => {
//   try {
//     let sql = `SELECT analytic_id, name, weightage,symbol FROM analytic where portfolio_id = ?`;
//     const result = await db.query(sql, [portfolio_id])
//     return result[0];
//   } catch (e) {
//     throw e
//   }
// }

exports.fetch = async (testlog_id, candidate_id) => {
  try {
    let sql = "SELECT questions.* from candidatetestdata inner join questions ON questions.question_id = candidatetestdata.question_id where testlog_id = ? and candidate_id = ? ORDER BY RAND() LIMIT 10"
    //[testlog_id, candidate_id, NULL])
    const result = await db.query(sql, [testlog_id, candidate_id])
    console.log(result)
    return result[0];
  } catch (e) {
    throw e
  }
}

exports.totalWe = async () => {
  try {
    let sql = `SELECT sum(close) as totalWe  FROM nse`;
    const result = await db.query(sql)
    return result[0][0]['totalWe'];
  } catch (e) {
    throw e
  }
}


exports.totalWeightage = async (portfolio_id) => {
  try {
    let sql = `SELECT sum(weightage) as totalWeightage  FROM analytic where portfolio_id = ?`;
    const result = await db.query(sql, [portfolio_id])
    return result[0][0]['totalWeightage'];
  } catch (e) {
    throw e
  }
}

exports.delete = async (param) => {
  try {
    let sql = `DELETE FROM analytic where analytic_id=?`;
    const result = await db.query(sql, [param.analytic_id])
    return true;
  } catch (e) {
    throw e
  }
}

exports.insertcandidate = async (param) => {
  const con = await db.getConnection()
  try {
    await con.beginTransaction();
    const result = await con.query("INSERT INTO candidatedetails (name,position, email, mobile,company_id) VALUE ( ?, ?, ?, ?, ? ) ",
      [param.name, param.position, param.email, param.mobile, param.company_id])
    await con.commit();
    await con.beginTransaction();
    const test = await con.query("INSERT INTO candidatetestlog (candidate_id,test, createdate,company_id,timelimit) VALUE ( ?, ?, NOW(), ?, ?) ",
      [result[0].insertId, 0, param.company_id, param.timelimit])
    await con.commit();
    return result[0].insertId;
  } catch (err) {
    console.log(err)
    await con.rollback();
    throw err;
  } finally {
    con.close()
  }
}
exports.insertqstn = async (param) => {
  const con = await db.getConnection()
  try {
    await con.beginTransaction();
    const result = await con.query("INSERT INTO questions (question,options, answer, company_id) VALUE ( ?, ?, ?, ?) ",
      [param.question, param.options, param.answer, param.company_id])
    await con.commit();
    return result[0];
  } catch (err) {
    console.log(err)
    await con.rollback();
    throw err;
  } finally {
    con.close()
  }
}
exports.editqstn = async (question_id, param) => {
  const con = await db.getConnection()
  try {
    await con.beginTransaction();
    const result = await con.query("update questions SET question = ?, options = ?, answer = ?, company_id = ? where question_id = ?",
      [param.question, param.options, param.answer, param.company_id, question_id])
    await con.commit();
    return result;
  } catch (err) {
    await con.rollback();
    throw err;
  } finally {
    con.close()
  }
}
exports.deleteqstn = async (param) => {
  try {
    let sql = `DELETE FROM questions where question_id=?`;
    const result = await db.query(sql, [param.question_id])
    return true;
  } catch (e) {
    throw e
  }
}