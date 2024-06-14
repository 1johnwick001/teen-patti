import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
      },
      otp: {
        type: String,
        required: false,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      mobile: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
      device_id: {
        type: String,
        required: true,
      },
      device_type: {
        type: String,
        required: true,
      },
      notification_token: {
        type: String,
        required: true,
      },
      game_type: {
        type: String,
        required: true,
      },
      total_game: {
        type: Number,
        required: true,
      },
      total_win: {
        type: Number,
        required: true,
      },
      total_coin: {
        type: Number,
        required: true,
      },
      avtar_id: {
        type: String,
        required: true,
      },
    })

const User = mongoose.model("User",userSchema);

export default User