const { db } = require('../config/config')

exports.create = async (param) => {
  const con = await db.getConnection()
  try {
    await con.beginTransaction();
    const result = await con.query("INSERT INTO userdetails (name, email, password,company_id,usertype) VALUE ( ?, ?, ?, ?, ? ) ",
      [param.name, param.email, param.password, param.company_id, param.usertype])
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
    let sql = `SELECT user_id,name,email,company_id,usertype FROM userdetails where email = ? and password = ?`;

    const result = await db.query(sql, [params.email, params.password])
    // console.log(result)
    return result[0];
  } catch (e) {
    throw e
  }
}
exports.getuserdetails = async () => {
  try {
    let sql = `SELECT * from userdetails`;
    const result = await db.query(sql)
    return result[0];
  } catch (e) {
    throw e
  }
}
exports.editpassword = async (userid, param) => {
  const con = await db.getConnection()
  try {
    await con.beginTransaction();
    let result = await con.query('update userdetails SET name = ? ,password = ?, email = ?,company_id = ? where user_id = ?',
      [param.name, param.password, param.email, param.company_id, userid])
    await con.commit();
    return result

  } catch (err) {
    con.rollback()
    throw err
  } finally {
    con.close();
  }
}
exports.deleteuser = async (param) => {
  try {
    let sql = `DELETE FROM userdetails where user_id=?`;
    const result = await db.query(sql, [param.userid])
    return true;
  } catch (e) {
    throw e
  }
}