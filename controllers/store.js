//Main LOgic is moved here
const Home=require('../models/home');
const User = require('../models/user');
const Booking = require('../models/booking');
exports.getHomes=(req,res,next)=>{
  Home.find().then(registeredHomes=>{
    res.render('store/home-list',{registeredHomes:registeredHomes,pageTitle:'Airbnb Home',isLoggedIn: req.isLoggedIn, user: req.session.user, });
});
}
exports.bookings=async (req, res, next) => {
  const userId = req.session.user._id;

  try {
    const bookings = await Booking.find({ user: userId }).populate('home');

    res.render('store/my-bookings', {
      bookings,
      pageTitle: 'My Bookings',
      isLoggedIn: req.isLoggedIn,
      user: req.session.user
    });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
};
exports.getBookingForm = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findById(homeId)
    .then(home => {
      if (!home) {
        return res.redirect('/');
      }
      res.render('store/bookings', {
        home,
        pageTitle: 'Booking Form',
        isLoggedIn: req.isLoggedIn,
        user: req.session.user,
      });
    })
    .catch(err => {
      console.log(err);
      res.redirect('/');
    });
};
exports.postBook = async (req, res, next) => {
  const { username, checkinDate, checkoutDate, time, homeId } = req.body;
  const userId = req.session.user._id;

  try {
    const booking = new Booking({
      user: userId,
      home: homeId,
      username,
      checkinDate,
      checkoutDate,
      time
    });

    await booking.save();

    res.send(`
      <html>
        <head><meta http-equiv="refresh" content="2; url=/" /></head>
        <body style="font-family: sans-serif; text-align: center; padding: 2em;">
          <h2>Booking Successful!</h2>
          <p>You will be redirected to the home page shortly...</p>
        </body>
      </html>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong. Please try again.");
  }
};

exports.getFavList = async (req, res, next) => {
  const userId = req.session.user._id;
  const user = await User.findById(userId).populate('favourites');
  res.render("store/fav-list", {
    favouriteHomes: user.favourites,
    pageTitle: "My Favourites",
    isLoggedIn: req.isLoggedIn, 
    user: req.session.user,
  });
};
exports.PostFav = async (req, res, next) => {
  const homeId = req.body.id;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if (!user.favourites.includes(homeId)) {
    user.favourites.push(homeId);
    await user.save();
  }
  res.redirect("/favourites");
};
exports.postRemoveFromFavourite = async (req, res, next) => {
  const homeId = req.params.homeId;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if (user.favourites.includes(homeId)) {
    user.favourites = user.favourites.filter(fav => fav != homeId);
    await user.save();
  }
  res.redirect("/favourites");
};
exports.getHomeDetails=(req,res,next)=>{
  const homeId=req.params.homeId;
  Home.findById(homeId).then(home=>{
    if (!home) {
      console.log("Home not found");
      res.redirect("/");
    } else {
      res.render("store/home-details", {
        home: home,
        pageTitle: "Home Detail",
        isLoggedIn: req.isLoggedIn ,
         user: req.session.user,

      });
};
});

}