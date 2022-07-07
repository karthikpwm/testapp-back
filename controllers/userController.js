const sha256 = require('js-sha256')
const jwt = require('jwt-then')
const User = require('./../models/User')

exports.register = async (req, res) => {
  const { name, email, password, company_id, usertype } = req.body;

  // const emailRegx = /@gmail.com/;
  //console.log(req.body)
  // if(!emailRegx.test(email)) throw "Email is not supported form your domain"
  if (password.length < 6) throw "Password must be atleast 6 characters long"
  const userExits = await User.findOneEmail({ email })
  if (userExits.length !== 0) throw "User Email Already Exist";

  await User.create({ name, email, password: sha256(password + process.env.SALT), company_id, usertype })

  res.json({
    message: `User [${name}] registered successfully`
  })
};

exports.login = async (req, res) => {
  const { email, password } = req.body
  const user = await User.connection({ email, password: sha256(password + process.env.SALT), })
  //console.log('userdetails', user[0].company_id, user.length)
  if (!user || user.length === 0) throw "Email and Password did not match"
  const companydet = await User.getonecomp({ comp: user[0].company_id })
  const token = await jwt.sign({ id: user.id }, process.env.SECRET)

  //console.log(token)
  res.json({
    user: user[0],
    message: user.email + "User logged successfully",
    companydetail: companydet[0],
    token,
  })
}
exports.logout = async (req, res) => {
  jwt.destry()
}
exports.getuserdetails = async (req, res) => {
  let data = await User.getuserdetails();

  res.json({ data: data })
};
exports.editpassword = async (req, res) => {
  if (Object.keys(req.params).length === 0 && req.params.userid === undefined) {
    throw '400:Parameter not Valid'
  }
  const { name, password, email, company_id } = req.body
  let result = await User.editpassword(req.params.userid, { name, email, password: sha256(password + process.env.SALT), company_id })
  res.json({ data: result })
}

exports.deleteuser = async (req, res) => {
  if (Object.keys(req.params).length === 0 && req.params.userid === undefined) {
    throw '400:Parameter not Valid'
  }

  const result = await User.deleteuser(req.params)
  res.json({
    message: 'record deleted successfully'
  })

};

exports.createcompany = async (req, res) => {
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    throw '400:Parameter not Valid'
  }
  const result = await User.createcompany(req.body)
  res.json({
    message: 'company added successfully',
    insert_id: result
  })
}
exports.getcompdetails = async (req, res) => {
  let data = await User.getcompdetails();

  res.json({
    data: data
  })
};