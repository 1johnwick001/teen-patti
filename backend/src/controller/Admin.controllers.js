import Admin from "../model/Admin.models.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const saltRounds = 10

const registerAdmin = async(req,res) => {
    try {
        // Extract username, email, and password from the request body

        const {username, email, password} = req.body

        // Hashing  password using bcrypt
        const hashPassword = await bcrypt.hash(password,saltRounds);

        //create new admin instance
        const newAdmin = new Admin({
            username,
            email,
            password:hashPassword
        }) 

        //generate a token
        const token = jwt.sign({email: newAdmin.email, id:newAdmin._id},process.env.JWT_SECRET_KEY)

        //check if the email or username alredy exists in the database
        const existingUser = await Admin.findOne({
            $or:[{username},{email}]
        })

        // If a user with the same email or username already exists, return an error response
        if (existingUser) {
            return res.status(209).json({
                code:209,
                status:false,
                message:"USERNAME OR EMAIL ALREADY EXISTS!!!",
                data:{}
            })
        }

        else if (password.length < 8) {
            return res.status(209).json({
                code:209,
                status:false,
                message:"password must be 8 charaacter long",
                data:{}
            })
        }

        await newAdmin.save() 

        return res.status(201).json({
            code:201,
            status:true,
            message:"Admin successfully registered",
            data:newAdmin,
            token:token
        })
        
    } catch (error) {
        console.error("Error while registering admin",error);
        return res.status(500).json({
            code:500,
            staus:false,
            message:"Error while registering admin",
            data:{}
        })
    }
}

const loginAdmin = async(req,res) => {

    try {

        const {email , password} = req.body

        //find user by email
        const admin = await Admin.findOne({email});

        if (!admin) {
            return res.status(404).json({
                code:404,
                status:false,
                message:"Admin with provided email does not exist",
                data:{}
            })

           
        }
       
        const matchedPassword = await bcrypt.compare(password,admin.password)
        
        if (!matchedPassword) {
            return res.status(404).json({
                code:404,
                status:false,
                message:"INCORRECT PASSWORDDDDD!!!!!!!",
                data:{}
            })
        }
        
        //generate a token
        const token = jwt.sign({
            email:admin.email,
            id:admin._id,
        },process.env.JWT_SECRET_KEY)

        
        return res.status(201).json({
            code:201,
            status:true,
            message:"Admin loggedIn successfully",
            data:admin,
            token:token
        })

    } catch (error) {
        console.error("Error while logging in admin",error);
        return res.status(500).json({
            code:500,
            status:false,
            message:"Server side Error while logging  Admin",
            data:{}
        })
    }
}

const logoutAdmin = async (req,res) => {
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




export  {registerAdmin,loginAdmin,logoutAdmin}