import express from "express"
import {registerUser, loginUser, logoutUser, getProfileList, getUserById, updateUser, deleteUser, forgotPasswordOTP, otpVerify, passwordUpdate, getLeaderboard } from "../controller/User.controller.js"
import Auth from "../middleware/Auth.js"

const router = express.Router()


router.post("/api/user/register",registerUser)
router.post("/api/user/login",loginUser)
router.post("/api/user/logout",logoutUser)

// api route for updating user profile


// api route for fetching profile of users
router.post("/api/user/profilelist",Auth,getProfileList)

//api for fetching leaderboard
router.post('/api/user/getleaderboard',Auth,getLeaderboard)

//api route for feetching user by id
router.get("/api/user/userbyid/:id",Auth,getUserById)
// updating edit user
router.post("/api/user/updateUser",Auth,updateUser)
//deleing user from database by id
router.delete("/api/user/deleteuser/:_id",Auth,deleteUser)
//forgot password otp 
router.post("/api/user/forgetpassotp",Auth,forgotPasswordOTP)
//verify otp
router.post("/api/user/vereifyotp",Auth,otpVerify)
//password update
router.put("/api/user/passwordupdate",Auth,passwordUpdate)


export default router