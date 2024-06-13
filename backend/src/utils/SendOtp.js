import nodemailer from "nodemailer"
import randomstring from "randomstring"


//otp
const sendOTP = async(email) => {
    //generating otp
    const otp = randomstring.generate({
        length: 6,
        charset: "numeric"
    })

    //send otp to users email
    const transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:"john.wick00000456@gmail.com",
            pass : 'kpxu fhsa owqf gics'
        }
    })

    await transporter.sendMail({
        to:email,
        subject:"Your otp to reset password for 3patti",
        text: `Your otp is: ${otp} and its valid for next 5mins`
    })
    return otp
}    

export default sendOTP