exports.pageNotFound=(req,res,next)=>{           //f a page is missing, they expect status 404, not 200.
//Without res.status(404), it might look like the page loaded fine (even when it didn’t).
  res.status(404).render('404Page',{pageTitle:'404 Page',isLoggedIn: req.isLoggedIn,user: req.session.user});
}