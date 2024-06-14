import User from "../model/User.models.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import sendOTP from "../utils/SendOtp.js";



const saltRounds = 10

//controller for registering user

const registerUser = async (req, res) => {
    try {
        const {
            name,
            email,
            mobile,
            otp,
            password,
            device_id,
            device_type,
            notification_token,
            game_type
        } = req.body;

        console.log(req.body);

        // Check password length
        if (password.length < 8) {
            return res.status(400).json({
                code: 400,
                status: false,
                message: "Password must be at least 8 characters long"
            });
        }

        // Check OTP if provided
        if (otp !== undefined){
            if (otp !== "123456") {
                return res.status(201).json({
                    code:400,
                    status:false,
                    message:"Invalid OTP, Please enter valid OTP!"
                });
            }
        

            // User validation if already registered
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(409).json({
                    code: 409,
                    status: false,
                    message: "User with this email already registered"
                });
            }

            // Hashing password using bcrypt
            const hashPassword = await bcrypt.hash(password, saltRounds);

            // Create new user instance
            const newUser = new User({
                name,
                email,
                mobile,
                password: hashPassword,
                device_id,
                device_type,
                notification_token,
                game_type,
                total_game: "0",
                total_win: "0",
                total_coin: "5000",
                avtar_id: "1",
            });

            await newUser.save();

            // Generate a token
            const token = jwt.sign({
                email: newUser.email,
                id: newUser._id,
            }, process.env.JWT_SECRET_KEY,);
            

            return res.status(201).json({
                data: {
                    _id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    mobile: newUser.mobile,
                    game_type: newUser.game_type,
                    total_game: newUser.total_game,
                    total_win: newUser.total_win,
                    total_coin: newUser.total_coin,
                    avtar_id: newUser.avtar_id,
                    token,
                },
                code: 201,
                status: true,
                message: 'User registered successfully',
            });

        } else {
            res.status(200).json({
                code:200,
                status:true,
                message:"OTP sent sccessfully"
            })
        }

    } catch (error) {
        console.log("Error registering user \n", error);
        return res.status(500).json({
            code: 500,
            status: false,
            message:"error registering user",
            message2: error,
            data: {}
        });
    }
};

const loginUser = async (req,res) => {
    try {

        const {email, password} = req.body;

        //check user by id
        const user = await User.findOne({email})

        if (!user) {
            return res.status(404).json({
                code:404,
                status:false,
                mesage:"user with given email was not found",
                data:{}
            })
        }

        //compare password
        const matchPassword = await bcrypt.compare(password, user.password)

        if (!matchPassword) {
            return res.status(404).json({
                code:404,
                status:false,
                message:"password did not match YO!@!@!@!"
            })
        }
        
           const token = jwt.sign({
                email: user.email,
                id: user._id,
            }, process.env.JWT_SECRET_KEY,);

            
            return res.status(200).json({
            code:200,
            status:true,
            message:'User logged in successfully',
            data:{
                _id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                game_type: user.game_type,
                total_game: user.total_game,
                total_win: user.total_win,
                total_coin: user.total_coin,
                avtar_id: user.avtar_id,
                token,
            },
        })

    } catch (error) {
        console.error("error while logging user in",error);
        return res.status(500).json({
            code:500,
            satus:false,
            message:"Server side issue while login user",
            data:{}
        })
    }
}

const logoutUser = async(req,res) => {
    try {
        //no user data is needed from request body cz of stateless login(JWT)
        return res.status(200).json({
            code:200,
            status:true,
            message:"Client logged out successfully"
        })
    } catch (error) {
        console.error("error while logging out user",error);
        return res.status(500).json({
            code:500,
            status:false,
            message:"server side issue while logging out ",
            data:{}
        })
    }
}

const getProfileList = async(req,res) => {
    try {
        const users = await User.find().select(' name email mobile device_id device_type notification_token game_type')

        return res.status(200).json({
            code:200,
            status:true,
            message:"profile list fetched successfully",
            data:users
        })
    } catch (error) {
        console.error("error while geting list of users:",error);
        return res.status(400).json({
            code:400,
            status:false,
            message:"Server side error while fetching list of users",
            data:{}
        })
    }
}

const getLeaderboard = async(req,res) => {
    try {
       //fetch all user from the db , selecting only name and total coins , and sort the result by 'total_coin in descending order
       const users = await User.find({}, 'name total_coin').sort({ total_coin: -1}).exec()

       //success response with the leaderboard data
       res.status(200).json({
        code: 200,
        status:true,
        message:"leaderboard fetched successfully",
        data: users
       })
    } catch (error) {
        console.log("error while fetching user profile: ",);
        res.status(500).json({
            status:false,
            message:"server side error while fetching leadeboard list ",
            error: error.message
        })
    }
}

const getUserById = async (req,res) => {
    try {
        const id = req.params.id;
        //findbyid method of mongoose to find the user bby id
        const user = await User.findById(id).select('username email countryCode phoneNumber');

        if (!user) {
            return res.status(404).json({
                code:404,
                status:false,
                message:"No user found with the provided ID",
                data:{}
            })
        }    

            // if user is found reurn in response
            res.status(200).json({
                code:200,
                status:true,
                message:"user by id",
                data:user
            })
        
    } catch (error) {
        console.error("Error fetching user data by ID:",error);
        res.status(500).json({
            code:500,
            satus:false,
            message:"Error while gwtting user data by ID",
            data:{}
        })
    }
}

const updateUser = async (req,res) => {
    try {
       
        const {id,name, total_game, total_win, total_coin, avtar_id} = req.body;

        const updateUser = await User.findByIdAndUpdate(id,{    name,
            total_game,
            total_win,
            total_coin,
            avtar_id,},{new:true})

        if (!updateUser) {
            return res.status(400).json({
                code:400,
                status:false,
                message:"user not found",
                data:{}
            })
        }

        return res.status(200).json({
            code:200,
            status:true,
            message:"user updated successfully",
            data:{
                name: updateUser.name,
                total_game: updateUser.total_game,
                total_win: updateUser.total_win,
                total_coin: updateUser.total_coin,
                avtar_id: updateUser.avtar_id,
            }
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            code:500,
            status:false,
            message:"Server error",
            data:{}
        })
    }
}

const deleteUser = async (req,res) => {
    const _id = req.params._id;
    try {
        const deleteUser = await User.findByIdAndDelete(_id).select('email');

        res.status(200).json({
            code:200,
            status:true,
            message:"user deleted successfully",
            data:deleteUser
        })
    } catch (error) {
        console.error("error deleting user",error);
        res.status(500).json({
            code:500,
            status:false,
            message:"Internal server error while deleting user",
            data:{}
        })
    }
}

const forgotPasswordOTP = async (req, res) => {
    try {
      const { email } = req.body;
  
  
      // Find the user by email
      const user = await User.findOne({ email });
  
      if (!user) {
        // User not found, don't send OTP and return appropriate response
        return res.status(404).json({
          code: 404,
          status: false,
          message: "User not found",
          data: {},
        });
      }

        // Generate OTP
        const forgetPassOtp = await sendOTP(email);

        const otpExpirationTime = Date.now() + 5 * 60 * 1000;
        const otpExpiresAt = new Date(otpExpirationTime).toLocaleTimeString()
  
      // Update the user's document with the OTP (only if user exists)
      user.forgetPassOtp = forgetPassOtp;
      user.otpExpiresAt = otpExpirationTime
      await user.save();
  
      return res.status(201).json({
        code: 201,
        status: true,
        message: "OTP sent successfully on registered email",
        data: { 
            
            otpExpiresAt
        }, // not including the OTP in the response for security reasons , 
      });
    } catch (error) {
      console.error("Error while sending OTP", error);
      return res.status(500).json({
        code: 500,
        status: false,
        message: "Server-side error while sending OTP",
        data: {},
      });
    }
};

const otpVerify = async(req,res) => {
    try {
        const {otp} = req.body;

        const user = await User.findOne({forgetPassOtp:otp})

        if (!user) {
            return res.status(404).json({
                code:404,
                status:false,
                message:"user not found",
                data:{}
            })
        }

        // Check if the OTP has expired
        if (user.otpExpiresAt < Date.now()) {
           return res.status(400).json({
            code:400,
            status:false,
            message:"OTP has expired",
            data: {}
           }) 
        }

        if (otp === user.forgetPassOtp) {
            user.forgetPassOtp = undefined;

            await user.save();

            return res.status(200).json({ 
                code:200,
                status:true,
                message: "OTP verified successfully",
                
            })
        }  else {
            return res.status(400).json({
                code:400,
                status:false,
                message:"Invalid OTP",
                data:{}
            })
        }

    } catch (error) {
        console.error("Error verifying OTP:",error);
        return res.status(500).json({
            code:500,
            status:false,
            message:"Server error while verifying OTP",
            data:{}
        })
    }
}

const passwordUpdate = async(req,res) => {
    try {
        const {email, password, conf_password} = req.body

        const user = await User.findOneAndUpdate({email},{password,conf_password},{new:true})

        if (!user) {
            return res.status(400).json({
                code:400,
                status:false,
                message:"user not found"
            })
        }

        if (password !== conf_password) {
            return res.status(209).json({
                code:209,
                status:false,
                message:"password do not match"
            })
        }

        //hash the new password
        const hashedPassword = await bcrypt.hash(password,saltRounds)
        //update the user's password
        user.password = hashedPassword;

        //save the updated user in db
        await user.save();
        return res.status(201).json({
            code:201,
            status:true,
            message:"password reset successfully",
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code:500,
            staus:false,
            message:"server side error while verifying otp",
            data:{}
        })
    }
}



export  {registerUser,loginUser,logoutUser,getProfileList,getLeaderboard,getUserById,updateUser,deleteUser,forgotPasswordOTP, otpVerify,passwordUpdate} 