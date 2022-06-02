const { db } = require('../config/config')

exports.create = async (param) => {
  const con = await db.getConnection()
  try {
    await con.beginTransaction();
    const result = await con.query("INSERT INTO userdetails (name, email, password) VALUE ( ?, ?, ? ) ",
      [param.name, param.email, param.password])
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
    let sql = `SELECT * FROM userdetails where email = ?`;

    const result = await db.query(sql, [params.email, params.password])
    console.log(result[0][0])
    return result[0];
  } catch (e) {
    throw e
  }
}
