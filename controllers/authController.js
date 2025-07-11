const { check, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
exports.getLogin=(req,res,next)=>{
 res.render('auth/login',{pageTitle:'Login',isLoggedIn: false,  errors: [],oldInput: {email: ""},  user: {}});
};
exports.getSignUp=(req,res,next)=>{
 res.render('auth/signup',{pageTitle:'SignUp',isLoggedIn: false,  errors: [],oldInput:  {firstname: "", lastname: "", email: "", userType: ""}, user: {} });
};
exports.postSignUp=[
  check("firstname")
  .trim()
  .isLength({min: 2})
  .withMessage("First Name should be atleast 2 characters long")
  .matches(/^[A-Za-z\s]+$/)
  .withMessage("First Name should contain only alphabets"),
   
   check("lastname")
  .matches(/^[A-Za-z\s]*$/)
  .withMessage("Last Name should contain only alphabets"),

  check("email")
  .isEmail()
  .withMessage("Please enter a valid email")
  .normalizeEmail(),

  check("password")
  .isLength({min: 5})
  .withMessage("Password should be atleast 5 characters long")
  .matches(/[A-Z]/)
  .withMessage("Password should contain atleast one uppercase letter")
  .matches(/[a-z]/)
  .withMessage("Password should contain atleast one lowercase letter")
  .matches(/[0-9]/)
  .withMessage("Password should contain atleast one number")
  .matches(/[!@&]/)
  .withMessage("Password should contain atleast one special character")
  .trim(),

   check("Confirmpassword")
  .trim()
  .custom((value, {req}) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),

  check("userType")
  .notEmpty()
  .withMessage("Please select a user type")
  .isIn(['guest', 'host']) //used because frontend controls can be bypassed
  .withMessage("Invalid user type"),

  check("terms")
  .notEmpty()
  .withMessage("Please accept the terms and conditions")
  .custom((value, {req}) => {
    if (value !== "on") {
      throw new Error("Please accept the terms and conditions");
    }
    return true;
  }),

  (req, res, next) => {
    const {firstname, lastname, email, password, userType} = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render("auth/signup", {
        pageTitle: "Signup",
        isLoggedIn: false,
        errors: errors.array().map(err => err.msg),
        oldInput: {firstname, lastname, email, password,userType},
        user: {},
      });
    }
    bcrypt.hash(password, 12)
    .then(hashedPassword => {
      const user = new User({firstname, lastname, email, password: hashedPassword, userType});
      return user.save();
    })
    .then(() => {
      res.redirect("/login");
    }).catch(err => {
      return res.status(422).render("auth/signup", {
        pageTitle: "Signup",
        isLoggedIn: false,
        errors: [err.message],
        oldInput: {firstname, lastname, email, userType},
        user: {},
      });
    });
  }
]

exports.postLogin= async (req, res, next) => {
  const {email, password} = req.body;
  const user = await User.findOne({email});
  if (!user) {
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      isLoggedIn: false,
      errors: ["User does not exist"],
      oldInput: {email},
      user: {},
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      isLoggedIn: false,
      errors: ["Invalid Password"],
      oldInput: {email},
      user: {},
    });
  }
  req.session.isLoggedIn = true;
  req.session.user = user;
  await req.session.save();

  res.redirect("/");
}
  

exports.postLogout=(req,res,next)=>{
   //res.cookie("isLoggedIn",false)
    req.session.destroy(() => {
    res.redirect("/login");
    })
  }
