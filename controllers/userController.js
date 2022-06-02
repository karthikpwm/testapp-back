const sha256 = require('js-sha256')
const jwt = require('jwt-then')
const User = require('./../models/user')

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  // const emailRegx = /@gmail.com/;
  console.log(req.body)
  // if(!emailRegx.test(email)) throw "Email is not supported form your domain"
  if (password.length < 6) throw "Password must be atleast 6 characters long"
  const userExits = await User.findOneEmail({
    email
  })
  if (userExits.length !== 0) throw "User Email Already Exit";

  await User.create({ name, email, password: sha256(password + process.env.SALT) })

  res.json({
    message: `User [${name}] register successfully`
  })
};

exports.login = async (req, res) => {
  const { email, password } = req.body
  const user = await User.connection({
    email,
    password: sha256(password + process.env.SALT)
  })
  console.log(user)
  if (user.length !== 0) throw "Email and Password did not match"

  const token = await jwt.sign({ id: user.id }, process.env.SECRET)
  res.json({
    message: user.email + "User logged successfully",
    token
  })
} 