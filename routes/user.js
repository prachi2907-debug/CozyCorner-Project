const express=require("express");
const userRouter=express.Router();
const homesController=require('../controllers/store');
userRouter.get("/",homesController.getHomes);
userRouter.get("/my-bookings",homesController.bookings);
userRouter.get("/favourites",homesController.getFavList);
userRouter.post("/favourites",homesController.PostFav);
userRouter.get("/home/:homeId",homesController.getHomeDetails);
userRouter.post("/favourites/delete/:homeId", homesController.postRemoveFromFavourite);
userRouter.get("/bookings/:homeId",homesController.getBookingForm);
userRouter.post("/bookings",homesController.postBook);

module.exports=userRouter;