//IT IS ONLY DOING ROUTER WORK NOW
const express=require("express");
const hostRouter=express.Router();
const homesController=require('../controllers/homes');
hostRouter.get("/host/add-home",homesController.getAddHome);
hostRouter.post("/host/add-home",homesController.postAddHome);
hostRouter.get("/host/home-list",homesController.getHostHomes);
hostRouter.get("/host/edit-home/:homeId", homesController.getEditHome);
hostRouter.post("/host/edit-home", homesController.postEditHome);
hostRouter.post("/host/delete-home/:homeId", homesController.postDeleteHome);

module.exports=hostRouter;

