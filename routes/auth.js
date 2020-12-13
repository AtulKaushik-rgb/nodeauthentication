const router = require("express").Router();
const User = require("../model/User");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt= require('jsonwebtoken')

const jsonParser = bodyParser.json();

const { registerValidation, loginValidation } = require("../validation");

router.post("/register", jsonParser, async (req, res) => {
  const { error } = registerValidation(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  console.log(req.body.email);
  //checking if the user is already in the database
  const emailExist = await User.findOne({ email: req.body.email });

  if (emailExist) return res.status(400).send("Email already exists");

  //hash passwords
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  //create a new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
  });

  try {
    const savedUser = await user.save();
    res.send({ user: user._id });
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

router.post("/login",jsonParser, async (req, res) => {
  console.log(req.body);
  const { error } = loginValidation(req.body);

  if (error) return res.status(400).send(error.details[0].message);

    //checking if the email exists
    const user = await User.findOne({ email: req.body.email });

    if (!user) return res.status(400).send("Email is not found");
  
    //if password is corrrect
    const validPass = await bcrypt.compare(req.body.password,user.password);

    if(!validPass) return res.status(400).send('Invalid password');

    //create ans assign a token

    const token = jwt.sign({_id:user._id},process.env.TOKEN_SECRET)
    res.header('auth-token',token).send(token);

    //res.send('logged in');

  //console.log(req.body.email);
 
});

module.exports = router;
