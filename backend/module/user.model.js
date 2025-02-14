import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from "crypto";

const userSchema = new Schema({
    role: {
        type: String,
        required: true,
        enum: ["user", "admin"],
        default: "user"
    },
    questionaire:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Questionaire",
        required:true,
    },
    fullname: {
        type: String,
        lowercase: true,
        required: true,
        trim: true,
        minLength: [5, "min length is 5"],
        maxLength: [50, "max length is 50"]
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true,
        minLength: [8, 'Password must be more than 8 character']
    },
    address: {
        type: String,
        required: true
    },
    Pincode: {
        type: Number,
        required: true,
        trim: true
    },
    State: {
        type: String,
        required: true,
        trim: true
    },
    avatar: {
        type: String, // cloudinary url
        required: true
    },
    refreshToken: {
        type: String,
        unique: true
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    subscription: {
        id: String,
        status: String
    }
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.verifyPassword = async function (password) {
    if (!this.password || !password) {
        throw new Error("password or this.password is not defined");
    }
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
}

userSchema.methods.generatePasswordResetToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.forgotPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    this.forgotPasswordExpiry = Date.now() + 15 * 60 * 1000; // 15 min from now
    return resetToken;
}

export const User = mongoose.model("User", userSchema);
