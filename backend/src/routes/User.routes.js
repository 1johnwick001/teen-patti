import express from "express"
import {registerUser, loginUser, logoutUser, getUserList, getUserById, updateUser, deleteUser, forgotPasswordOTP, otpVerify, passwordUpdate } from "../controller/User.controller.js"
import Auth from "../middleware/Auth.js"

const router = express.Router()


router.post("/api/user/register",registerUser)
router.post("/api/user/login",loginUser)
router.post("/api/user/logout",logoutUser)

// api route for updating user profile


// api route for fetching profile of users
router.get("/api/user/userlist",getUserList)
//api route for feetching user by id
router.get("/api/user/userbyid/:id",getUserById)
// updating edit user
router.put("/api/user/updateUser",updateUser)
//deleing user from database by id
router.delete("/api/user/deleteuser/:_id",deleteUser)
//forgot password otp 
router.post("/api/user/forgetpassotp",forgotPasswordOTP)
//verify otp
router.post("/api/user/vereifyotp",otpVerify)
//password update
router.put("/api/user/passwordupdate",passwordUpdate)


export default router