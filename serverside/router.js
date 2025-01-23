import { Router } from "express";
import Auth from "./Authentication/Auth.js"
import * as rh from './reqhandler.js'
const router=Router();


router.route("/register").post(rh.register)
router.route("/login").post(rh.login)
router.route("/verify").post(rh.verifyEmail)
router.route("/user/:id").get(Auth,rh.showuser)
router.route("/navdata").get(Auth,rh.navdata)
router.route("/editprofile").put(Auth,rh.editprofile)
router.route("/verifypass").post(rh.verifyforpasschange)
router.route("/passchange").post(rh.passchange)
router.route("/showcontacts").get(Auth,rh.showContacts)
router.route("/sendmsg/:id").post(Auth,rh.message)
router.route("/displaymsg/:id").get(Auth,rh.displaymessage)
router.route("/setseen/:id").put(Auth,rh.seemsg)
router.route("/createchatlist/:id").post(Auth,rh.createChatList)
router.route("/showchatlist").get(Auth,rh.displayChatList)
router.route("/reciver/:id").get(rh.reciverdetails)
router.route("/setcount/:id").put(Auth,rh.setcount)
export default router