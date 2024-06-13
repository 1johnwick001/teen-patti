import mongoose from "mongoose"

const GameSchema = new mongoose.Schema({
    gameName:{
        type:String,
        required:true
    },
    gamePhoto:{
        type:String,
        required:true
    },
    gameType:{
        type:String,
        required:true
    }
},{timestamps:true})


const Game = mongoose.model("Game",GameSchema);

export default Game