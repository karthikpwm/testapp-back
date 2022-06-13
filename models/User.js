const { db } = require('../config/config')

exports.create = async (param) => {
  const con = await db.getConnection()
  try {
    await con.beginTransaction();
    const result = await con.query("INSERT INTO userdetails (name, email, password,company_id) VALUE ( ?, ?, ?, ? ) ",
      [param.name, param.email, param.password, param.company_id])
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

exports.findOneEmail = async (params) => {
  try {
    let sql = `SELECT * FROM userdetails where email = ?`;
    const result = await db.query(sql, params.email)
    return result[0];
  } catch (e) {
    throw e
  }
}

exports.connection = async (params) => {
  try {
    //console.log('asdfasdf', params)
    let sql = `SELECT user_id,name,email,company_id FROM userdetails where email = ? and password = ?`;

    const result = await db.query(sql, [params.email, params.password])
    // console.log(result)
    return result[0];
  } catch (e) {
    throw e
  }
}
