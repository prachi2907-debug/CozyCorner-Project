//Main LOgic is moved here
const Home=require('../models/home');
exports.getAddHome=(req,res,next)=>{
 res.render('host/edit-home',{pageTitle:'Add Home',editing:false,isLoggedIn: req.isLoggedIn ,user: req.session.user,});
};
exports.getHostHomes = (req, res, next) => {
  Home.find().then(registeredHomes =>
    res.render("host/host-homelist", {
      registeredHomes: registeredHomes,
      pageTitle: "Host Homes List",
      isLoggedIn: req.isLoggedIn ,
       user: req.session.user,
    })
  );
};
exports.getEditHome=(req,res,next)=>{
  const homeId=req.params.homeId;
  const editing=req.query.editing==='true';
  Home.findById(homeId).then(home=>{
    if (!home) {
      console.log("Home not found");
      return res.redirect("/");
    } 
      res.render("host/edit-home", {
        home: home,
        pageTitle: "Edit Home Page",
        editing:editing,
        isLoggedIn: req.isLoggedIn ,
         user: req.session.user,

      });
});
};
exports.postAddHome=(req,res,next)=>{
const{houseName,price,location,rating,photoUrl, description}=req.body;
//const home=new Home(req.body.houseName,req.body.price,req.body.location,req.body.rating,req.body.photoUrl); One Way
//Other way
const home=new Home({houseName,price,location,rating,photoUrl,  description, user: req.session.user,});
home.save()
res.redirect("/");
};
exports.postEditHome = (req, res, next) => {
  const { id, houseName, price, location, rating, photoUrl ,description } = req.body;
    Home.findById(id).then((home) => {
    home.houseName = houseName;
    home.price = price;
    home.location = location;
    home.rating = rating;
    home.photoUrl = photoUrl;
     home.description = description;
    home.save().then((result) => {
      console.log("Home updated ", result);
    }).catch(err => {
      console.log("Error while updating ", err);
    })
    res.redirect("/host/home-list");
  }).catch(err => {
    console.log("Error while finding home ", err);
  });
};
exports.postDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findByIdAndDelete(homeId).then(() => {
    res.redirect("/host/home-list");
  }).catch(error => {
    console.log('Error while deleting ', error);
  })
};