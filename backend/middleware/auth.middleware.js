import jwt from "jsonwebtoken";
import { asyncHandler } from "../utilities/asyncHandler.js";
import ApiError from "../utilities/ApiError.js";
import { User } from "../module/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        try {
            const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

            if (!user) {
                // Clear invalid token cookie
                res.clearCookie("accessToken");
                throw new ApiError(401, "Invalid Access Token");
            }

            req.user = user;
            next();
        } catch (jwtError) {
            // Clear invalid token cookie
            res.clearCookie("accessToken");
            throw new ApiError(401, "Invalid or expired token");
        }
    } catch (error) {
        next(error);
    }
});

export const authorizedRoles = (...roles) => async (req, res, next) => {
    try {
        // console.log('entered auth')
        const currentUserRole = req.user.role;
        if (!roles.includes(currentUserRole)) {
            throw new ApiError(403, "You do not have permission to access this resource");
        }
        next();
    } catch (error) {
        console.error("Error in authorizedRoles middleware:", error);
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};
