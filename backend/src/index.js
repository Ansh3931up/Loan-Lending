import app from "./app.js";
import connectdb from "../database/connectdb.js";
// import Razorpay from "razorpay";
import dotenv from 'dotenv';

dotenv.config();

export const config = {
    PORT: process.env.PORT || 8000,
    MONGODB_URI: process.env.MONGODB_URI,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY
};

// console.log(process.env.RAZORPAY_KEY)
// export const razorpay= new Razorpay({
//     key_id:process.env.RAZORPAY_KEY,
//     key_secret:process.env.RAZORPAY_KEY_SECRET
// })

connectdb()
.then(()=>{
    app.listen(config.PORT,()=>{
        console.log(`SUCCESSFully connected ${config.PORT}`);
    });

})
.catch((error)=>{
    console.log(error);

})