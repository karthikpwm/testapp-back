const { db } = require('../config/config')

exports.starttest = async (candidate_id) => {
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
    await con.query("insert into candidatetestdata (testlog_id,candidate_id,question_id,answer,createddate) select ?,?,question_id,?,now() from questions limit 20",
      [testlog_id, candidate_id, null])
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
exports.deletecan = async() => {
  try {
    let sql = `truncate table candidatetestdata `;
    const result = await db.query(sql)
    return true;
  } catch (e) {
    throw e
  }
}

exports.answertest = async (testlog_id, candidate_id, userAnswers) => {
  const con = await db.getConnection()
  try {

    await con.beginTransaction();
    let getUserAnswers = []
    for (const [key, value] of Object.entries(userAnswers)) {
      const result = await con.query("update candidatetestdata set answer = ? where testlog_id = ? and candidate_id = ? and question_id = ?",
        [value, testlog_id, candidate_id, key])
    }

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
    // let sql = `SELECT IF(candidatetestdata.answer=questions.answer, "1", "0") as correct, candidatetestdata.*,candidatedetails.*,questions.answer as originalanswer from candidatetestdata inner join candidatedetails
    // on candidatedetails.candidate_id = candidatetestdata.candidate_id INNER JOIN questions on questions.question_id=candidatetestdata.question_id`;
    let sql = `SELECT IF(candidatetestdata.answer=questions.answer, "1", "0") as correct,candidatedetails.*,SUM(IF(candidatetestdata.answer=questions.answer, "1", "0")) as totalcorrect,candidatetestdata.createddate as date 
    from candidatetestdata inner join candidatedetails on candidatedetails.candidate_id = candidatetestdata.candidate_id INNER JOIN questions on questions.question_id=candidatetestdata.question_id GROUP BY candidatetestdata.candidate_id`;
    const result = await db.query(sql)
    return result[0];
  } catch (e) {
    throw e
  }
}

exports.getcandidateqstnmarks = async () => {
  try {
    let sql = `SELECT IF(candidatetestdata.answer=questions.answer, "1", "0") as correct, candidatetestdata.*,questions.*, candidatetestdata.answer as candidateanswer from candidatetestdata
      inner join questions on questions.question_id = candidatetestdata.question_id and candidatetestdata.candidate_id = 23 and candidatetestdata.answer IS NOT NULL`;
    const result = await db.query(sql)
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
    const result = await con.query("INSERT INTO candidatedetails (name,position, email, mobile) VALUE ( ?, ?, ?, ? ) ",
      [param.name, param.position, param.email, param.mobile])
    await con.commit();
    await con.beginTransaction();
    const test = await con.query("INSERT INTO candidatetestlog (candidate_id,test, createdate) VALUE ( ?, ?, NOW()) ",
      [result[0].insertId, 0])
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


// exports.upexcel = async (param) => {
//   const con = await db.getConnection()
//   try {
//     await con.beginTransaction();
//     const result = await con.query("INSERT INTO analytic (portfolio_id,name, weightage, symbol) VALUE ( ?, ?, ?, ? ) ",
//       [param.portfolio_id, param.name, param.weightage, param.symbol])
//     await con.commit();
//     return result[0].insertId;
//   } catch (err) {
//     await con.rollback();
//     throw err;
//   } finally {
//     con.close()
//   }
// }

// exports.postUploadRecord = async (params) => {
//   const con = await db.getConnection()
//   try {
//     await con.beginTransaction();
//     await params.bulkData.forEach(async (param) => {
//       let sql = `UPDATE analytic set weightage = ? where analytic_id = ?`
//       const result = await con.query(sql,
//         [param.weightage, param.analytic_id])
//     });

//     await con.commit();
//     return true;
//   }
//   catch (err) {
//     await con.rollback();
//     throw err;
//   } finally {
//     con.close()
//   }

// }

// exports.upload = async (params) => {
//   // const con = await db.getConnection()
//   try {
//     // await con.beginTransaction();
//     // await params.excelData.forEach( async (param) => {
//     //   let sql=  `insert INTO analytic (portfolio_id,name, weightage, symbol) VALUE ( ?, ?, ?, ? )`
//     //   const result =  await con.query(sql,
//     //      [param.portfolio_id,param.name,param.weightage,param.symbol])

//     //   });
//     //   await con.commit();
//     await params.excelData.forEach(async (param) => {
//       let sql = `SELECT * FROM analytic WHERE portfolio_id = ? and symbol = ? LIMIT 1`;
//       const result = await db.query(sql, [param.portfolio_id, param.symbol])
//       //console.log('dgdfgfdg',result[0][0]['analytic_id'] ,[param.portfolio_id,param.symbol]);           
//       const analytic_id = result[0][0] != undefined ? result[0][0]['analytic_id'] : null;
//       //console.log('ansfasf',analytic_id)
//       // await con.beginTransaction();
//       if (!analytic_id) {
//         //console.log('insert ',param.portfolio_id)
//         let sql = `insert INTO analytic (portfolio_id,name, weightage, symbol) VALUE ( ?, ?, ?, ? )`
//         await db.query(sql,
//           [param.portfolio_id, param.name, param.weightage, param.symbol])
//       }
//       else {
//         //console.log('updated')
//         let sql = `UPDATE analytic SET weightage = ? WHERE analytic_id = ?`
//         await db.query(sql,
//           [param.weightage, analytic_id])
//       }
//       //await con.commit();               
//     });
//     return true;
//   }
//   catch (err) {
//     // await con.rollback();
//     throw err;
//   } finally {
//     // con.close()
//   }

// }

// exports.uploadnse= async(params) =>{
//    const con = await db.getConnection()
//   try {
//      await con.beginTransaction();
//     // await params.excelData.forEach( async (param) => {
//     //   let sql=  `insert INTO analytic (portfolio_id,name, weightage, symbol) VALUE ( ?, ?, ?, ? )`
//     //   const result =  await con.query(sql,
//     //      [param.portfolio_id,param.name,param.weightage,param.symbol])

//     //   });
//     //   await con.commit();

//     await params.excelData.forEach( async (param) => {
//       console.log('inserted')
//       const result =  await con.query(`insert INTO nse (close, prevclose, symbol,series) VALUE ( ?, ?, ?, ? )`,
//       [param.CLOSE,param.PREVCLOSE,param.SYMBOL,param.SERIES])
//       //const result =  await db.query(sql,[param.SYMBOL])  
//       console.log(result[0][0],param.CLOSE); 
//       // let sql1 = `SELECT * FROM nse WHERE symbol = ? LIMIT 1`;
//       // const result1 = await db.query(sql1,[param.symbol]) 
//     //   console.log(result[0][0]);           
//     //   const nse_id = result[0][0] != undefined ? result[0][0]['nse_id'] : null;
//     //   //const bsymbol = result[0][4] != undefined ? result[0][4]['bsymbol'] : null;
//     //   //const nse_id =  result1 != undefined ? result1[0][0]['nse_id'] : null;
//     //  console.log('ansfasf',nse_id)
//     //   // await con.beginTransaction();
//     //  if( !nse_id ) {
//     //   console.log('insert')
//     //   let sql=  `insert INTO nse (close, prevclose, symbol,series) VALUE ( ?, ?, ?, ? )`
//     //   console.log(sql)
//     //   await db.query(sql,
//     //     [param.CLOSE,param.PREVCLOSE,param.SYMBOL,param.SERIES])

//     //  }
//     //   else {
//     //     console.log('updated')
//     //     let sql=  `UPDATE nse SET close = ?  WHERE symbol = ?`

//     //     await db.query(sql,
//     //       [param.CLOSE,param.SYMBOL])

//     //       console.log(sql)
//     //   }
//       // await con.commit(); 

//       return result[0].insertId;            
//     });
//     console.log('ho')
//   }
//   catch ( err ) {
//     // await con.rollback();
//     throw err;
//   } finally {
//     // con.close()
//   }

// }

// exports.uploadnse = async (params) => {
//   // const con = await db.getConnection()
//   try {
//     // await con.beginTransaction();
//     // await params.excelData.forEach( async (param) => {
//     //   let sql=  `insert INTO analytic (portfolio_id,name, weightage, symbol) VALUE ( ?, ?, ?, ? )`
//     //   const result =  await con.query(sql,
//     //      [param.portfolio_id,param.name,param.weightage,param.symbol])

//     //   });
//     //   await con.commit();

//     await params.excelData.forEach(async (param) => {
//       let sql = `SELECT * from nse where symbol = ? and
//       series = ? and isin = ? LIMIT 1`;
//       const result = await db.query(sql, [param.SYMBOL, param.SERIES, param.ISIN])

//       // let sql1 = `SELECT * FROM nse WHERE symbol = ? LIMIT 1`;
//       // const result1 = await db.query(sql1,[param.symbol]) 
//       //console.log(result[0][0]);           
//       const nse_id = result[0][0] != undefined ? result[0][0]['nse_id'] : null;
//       //const bsymbol = result[0][4] != undefined ? result[0][4]['bsymbol'] : null;
//       //const nse_id =  result1 != undefined ? result1[0][0]['nse_id'] : null;
//       //console.log('ansfasf',nse_id)
//       // await con.beginTransaction();
//       if (!nse_id) {
//         //console.log('insert')
//         let sql = `insert INTO nse (close, prevclose, symbol,series,isin) VALUE ( ?, ?, ?, ?, ? )`
//         //console.log(sql)
//         await db.query(sql,
//           [param.CLOSE, param.PREVCLOSE, param.SYMBOL, param.SERIES, param.ISIN])

//       }
//       else {
//         //console.log('updated')
//         let sql = `UPDATE nse SET close = ?   WHERE symbol = ? and isin = ?`

//         await db.query(sql,
//           [param.CLOSE, param.SYMBOL, param.ISIN])
//         //console.log('first sql', sql)
//         let sql1 = `UPDATE nse SET prevclose = ?   WHERE symbol = ? and isin = ?`

//         await db.query(sql1,
//           [param.PREVCLOSE, param.SYMBOL, param.ISIN])

//         //console.log('2nd sql', sql1)
//         //console.log(sql)
//       }
//       // await con.commit();               
//     });
//     return true;
//   }
//   catch (err) {
//     // await con.rollback();
//     throw err;
//   } finally {
//     // con.close()
//   }

// }


// exports.updateRecord = async (analytic_id, param) => {
//   const con = await db.getConnection()
//   try {
//     await con.beginTransaction();
//     const result = await con.query("UPDATE analytic SET name = ?, weightage = ?, symbol = ? WHERE analytic_id = ? ",
//       [param.name, param.weightage, param.symbol, analytic_id])
//     await con.commit();
//     return result;
//   } catch (err) {
//     await con.rollback();
//     throw err;
//   } finally {
//     con.close()
//   }
// }
// exports.update = async(param) =>{
//   const con = await db.getConnection()
//   try {

//     let sql = (`UPDATE analytic set weightage = ? where analytic_id = ?`,
//     [param.weightage,param.analytic_id])
//     const result =  await db.query(sql)
//     return true;
//   }
//   catch(e){
//     throw e
//   }

// }

// exports.findOne = async (customer_id) => {
//   try {

//     let sql = `SELECT credit_id, amount, date, remarks FROM customer_credit as credit where
//     credit.deleted = 0 AND credit.credit_id = ?`;
//     const result =  await db.query(sql, [customer_id])
//     return result[0];
//   } catch (e) {
//     throw e
//   }
// }

// exports.deleteRecord = async ( customer_id ) => {
//   const con = await db.getConnection()
//   try {
//     await con.beginTransaction();
//     const result =  await con.query("UPDATE customer_credit SET deleted = 1 WHERE credit_id = ? ",
//       [ customer_id  ])
//     await con.commit();
//     return result;
//   } catch ( err ) {
//     await con.rollback();
//     throw err;
//   } finally {
//     con.close()
//   }
// }

// exports.update = async ( credit_id, param ) => {
//   const con = await db.getConnection()
//   try {
//     await con.beginTransaction();
//     const result =  await con.query("UPDATE customer_credit SET amount = ?, date = ?, remarks = ? WHERE credit_id = ? ",
//       [param.amount, param.date, param.remarks, credit_id ])
//     await con.commit();
//     return result;
//   } catch ( err ) {
//     await con.rollback();
//     throw err;
//   } finally {
//     con.close()
//   }
// }
