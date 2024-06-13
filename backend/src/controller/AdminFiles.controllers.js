import Game from "../model/Games.models.js";


const addGame = async(req,res) => {
    try {
        const {gameName, gameType} = req.body;

        if (!req.file) {
            return res.status(400).json({
                message:"No file uploaded"
            })
        }

        const gamePhoto = req.file ? req.file.filename:null

        const gameData = new Game({
            gameName,
            gameType,
            gamePhoto
        });

        const savedGame = await gameData.save();

        return res.status(200).json({
            code:200,
            status:true,
            message:"File uploaded and game data saved successfully",
            data:savedGame
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code:500,
            status:false,
            message:"Error uploading file",
            data:{}
        })
    }
}

const getGameList = async(req,res) => {
    try {
        const gameList = await Game.find();
        return res.status(200).json({
            code:200,
            status:true,
            message:"Game list fetched successfully",
            data:gameList
        })
    } catch (error) {
        console.error('Error fetching games list',error);
        return res.status(500).json({
            code:500,
            status:false,
            message:"internal server error",
            data:{}
        })
    }
}

//fetching list based on id
const getGameListById = async(req,res) => {
    try {
        const id = req.params.id;
        //findbyid method to fetch game by id

        const game = await Game.findById(id);

        if (!game) {
            return res.status(404).json({
                code:404,
                status:false,
                message:"No game found with the provided ID",
                data:{}
            })
        }

        //if game is found return it with the resp
        res.status(200).json({
            code:200,
            status:true,
            message:"Game data successfully fetched",
            data: game
        });

    } catch (error) {
        console.error("error fetching game data by ID:",error);
        res.status(500).json({
            code:500,
            status:false,
            message:"Error while getting game data by ID",
            data:{}
        })
    }
}

const updateGame = async(req,res) => {
    try {
        const {id} = req.params
        const {gameName, gameType} = req.body

        //check if a new file is uploaded
        if (req.file) {
            //handle new file upload
            const gamePhoto = req.file.filename;
            //update game with new image
            await Game.findByIdAndUpdate(id,{gameName, gameType, gamePhoto});
        } else {
            //no new file uploaded , keep the existing image , update game withoutmodifying the image field
            await Game.findByIdAndUpdate(id,{gameName, gameType})
        }

        res.status(200).json({
            code:200,
            status:true,
            message:"Game list updated successfully",
        })

    } catch (error) {
        console.error("error updating game",error);
        res.status(500).json({
            code:500,
            status:false,
            message:"server error while updating game",
            data:{}
        })
    }
}

const deleteGame = async (req,res) => {
    const gameId = req.params.id;
    try {
        //find the game by its id and remove it from the database
        await Game.findByIdAndDelete(gameId);
        res.status(200).json({
            code:200,
            status:true,
            message:"Game deleted successfully"
        })
    } catch (error) {
        console.error("error deleting game ",error);
        res.status(500).json({
            code:500,
            status:false,
            message:"internal server error"
        })

    }
}

export  {addGame,getGameList,getGameListById,updateGame,deleteGame}