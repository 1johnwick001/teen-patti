import express from "express";
import multer from "multer";
import path from "path";

import { registerAdmin,loginAdmin, logoutAdmin } from "../controller/Admin.controllers.js";
import  {addGame, deleteGame, getGameList, getGameListById, updateGame } from "../controller/AdminFiles.controllers.js";
import Auth from "../middleware/Auth.js";

const router = express.Router()

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"uploads/photos")
    },filename:(req,file,cb)=>{
        cb(null,file.fieldname + "-" + Date.now() + path.extname (file.originalname))
    }
})

const upload = multer({
    storage:storage
})







router.post('/api/admin/register',registerAdmin)
router.post('/api/admin/login',loginAdmin)
router.post("/api/admin/logout",logoutAdmin)


// !<------------games routing for uploading , fetching and deleting etc.------------->!
router.post("/api/admin/addgame",Auth,upload.single('gamePhoto'),addGame)

//api for fetching gameslist
router.get("/api/admin/gameList",Auth,getGameList)

//api for fetching game by id
router.get("/api/admin/gamelistbyid/:id",Auth,getGameListById)

//api for updatigng gamelist
router.put("/api/admin/gameupdate/:id",Auth,upload.single("gamePhoto"),updateGame)

//api for deleting game list data
router.delete("/api/admin/deletegame/:id",Auth,deleteGame)

export default router
