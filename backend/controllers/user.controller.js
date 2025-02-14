import { User } from '../module/user.model.js';
import ApiError from '../utilities/ApiError.js';
import ApiResponse from '../utilities/ApiResponse.js';
import {asyncHandler } from '../utilities/asyncHandler.js'
import { uploadOnCloudinary } from '../utilities/cloudinary.js';
import Questionaire from '../module/questionaire.model.js';
// import sendEmail from '../utilities/sendEmail.js';
// import crypto from "crypto";


const generateAccessandrefershToken = async (userid) => {
    try {
        const user = await User.findById(userid);
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // Update user with new refresh token
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        console.error("Token generation error:", error);
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
};

// Update cookie options to ensure they can be stored in browser
const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Only use secure in production
    sameSite: process.env.NODE_ENV === "production" ? 'None' : 'Lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
    domain: process.env.NODE_ENV === "production" ? process.env.DOMAIN : 'localhost' // Add your domain in production
};

const register=asyncHandler(async(req,res)=>{
    const {fullname,email,password,State,Pincode,address,role}=req.body;

    if([fullname,email,password,State,Pincode,address].some((item)=>item?.trim()==='')){
        throw new ApiError(404,"Required data is incomplete");
    }
    const existing=await User.findOne({
        $or:[{email},{fullname}]
    })
    console.log(existing);
    if(existing){
        throw new ApiError(404,"This user already exists")
    }

    console.log(req.file);
    console.log(req.file.path);
    const avatarLocalPath=req.file?.path;//ye req ka extra path files vala multer provide krata ha
    // // const coverImageLocalPath=req.files?.coverImage[0]?.path; 

   
    if(!avatarLocalPath){
    throw new ApiError(400,"Avatar file is required")
    }


    const avatar=await uploadOnCloudinary(avatarLocalPath);
    // // const coverImage= await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar){
    throw new ApiError(400,"Failed to upload avatar")
    }

    const user=await User.create({
        fullname,
        avatar:avatar.url,
        email,
        password,
        State,
        Pincode,
        address,
        role: role || "user",
        // questionaire field will be undefined initially
        
        
    })

    // Generate tokens immediately after user creation
    const { accessToken, refreshToken } = await generateAccessandrefershToken(user._id);

    // Get user without sensitive information
    const createdUser=await User.findById(user._id).select(
    "-password -refreshToken"//id seelect krka password and refreshToken isma sa delete kr diya
    )
    //isa pta chalaga ki user create bi hua ha ki nhi

    if(!createdUser){
        throw new ApiError(400,"Something went wrong while registering the user")
    }
    // await user.save();
    // const {accessToken,refreshToken}=await generateAccessandrefershToken(user._id);

    // Set cookies with updated options
    res.cookie("accessToken", accessToken, options);
    res.cookie("refreshToken", refreshToken, options);

    // Return response
    return res
        .status(201)
        .json(
            new ApiResponse(
                201, 
                {
                    user: createdUser,
                    accessToken,
                    refreshToken
                },
                "User registered and logged in successfully"
            )
        );

    }) 
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({ email });
    
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await user.verifyPassword(password);
    
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } = await generateAccessandrefershToken(user._id);

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, 
                { user: user.toObject(), accessToken, refreshToken },
                "Logged in successfully"
            )
        );
});

const logout=asyncHandler(async(req,res)=>{

    const user=req.user;
    if(!user){
        throw new ApiError(404,"no user logged in");
    }
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:
            {refreshToken:undefined}
        },{
            new:true
        }

    )
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"user logout "))
})

const updateQuestionaire = asyncHandler(async (req, res) => {
    const {
        age,
        gender,
        monthlyIncome,
        existingLoans,
        outstandingLoanAmount,
        debtPercentage,
        creditCardDebt,
        otherIncomeSources,
        employmentStatus,
        employmentType,
        yearsInCurrentJob,
        incomeSteady,
        cibilScore,
        propertyOwnership,
        investments,
        savingsAmount,
        financialDisputes,
        guarantor
    } = req.body;

    const user = req.user;
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Find existing questionaire or create new one
    let questionaire = await Questionaire.findOne({ userId: user._id });
    
    if (questionaire) {
        // Update existing questionaire
        questionaire = await Questionaire.findOneAndUpdate(
            { userId: user._id },
            {
                age,
                gender,
                monthlyIncome,
                existingLoans,
                outstandingLoanAmount,
                debtPercentage,
                creditCardDebt,
                otherIncomeSources,
                employmentStatus,
                employmentType,
                yearsInCurrentJob,
                incomeSteady,
                cibilScore,
                propertyOwnership,
                investments,
                savingsAmount,
                financialDisputes,
                guarantor
            },
            {
                new: true,
                runValidators: true
            }
        );
    } else {
        // Create new questionaire
        questionaire = await Questionaire.create({
            userId: user._id,
            age,
            gender,
            monthlyIncome,
            existingLoans,
            outstandingLoanAmount,
            debtPercentage,
            creditCardDebt,
            otherIncomeSources,
            employmentStatus,
            employmentType,
            yearsInCurrentJob,
            incomeSteady,
            cibilScore,
            propertyOwnership,
            investments,
            savingsAmount,
            financialDisputes,
            guarantor
        });

        // Update user with questionaire reference
        await User.findByIdAndUpdate(
            user._id,
            {
                questionaire: questionaire._id
            },
            { new: true }
        );
    }

    return res
        .status(200)
        .json(new ApiResponse(200, questionaire, "Questionaire updated successfully"));
});

const getUser=asyncHandler(async(req,res)=>{
    const user=req.user;
    if(!user){
        throw new ApiError(404,"User not found");
    }
    return res.status(200).json(new ApiResponse(200,user,"User fetched successfully"));
})

const defaultQuestions = [
    {
        id: "q1",
        question: "What is your age?",
        type: "select",
        options: ["18-25", "26-35", "36-45", "46-55", "56+"]
    },
    {
        id: "q2",
        question: "What is your gender?",
        type: "select",
        options: ["Male", "Female", "Other", "Prefer not to say"]
    },
    {
        id: "q3",
        question: "What is your monthly income?",
        type: "select",
        options: ["Less than ₹25,000", "₹25,000-₹50,000", "₹50,001-₹75,000", "₹75,001-₹1,00,000", "More than ₹1,00,000"]
    },
    {
        id: "q4",
        question: "Do you have any existing loans?",
        type: "select",
        options: ["Yes", "No"]
    },
    {
        id: "q5",
        question: "What is your employment status?",
        type: "select",
        options: ["Full-time employed", "Part-time employed", "Self-employed", "Unemployed", "Student"]
    },
    {
        id: "q6",
        question: "What is your credit score range?",
        type: "select",
        options: ["Below 600", "600-650", "651-700", "701-750", "Above 750", "Don't know"]
    },
    {
        id: "q7",
        question: "Do you have any outstanding loan amount?",
        type: "number"
    },
    {
        id: "q8",
        question: "What is your debt percentage?",
        type: "number"
    },
    {
        id: "q9",
        question: "Do you have any credit card debt?",
        type: "number"
    },
    {
        id: "q10",
        question: "Do you have any other income sources?",
        type: "select",
        options: ["Yes", "No"]
    },
    {
        id: "q11",
        question: "Do you have any financial disputes?",
        type: "select",
        options: ["Yes", "No"]
    },
    {
        id: "q12",
        question: "Do you have any property ownership?",
        type: "select",
        options: ["Yes", "No"]
    },
    {
        id: "q13",
        question: "Do you have any investments?",
        type: "select",
        options: ["Yes", "No"]
    },
    {
        id: "q14",
        question: "Do you have any savings amount?",
        type: "number"
    },
    {
        id: "q15",
        question: "Do you have any employment type?",
        type: "select",
        options: ["Full-time", "Part-time", "Self-employed", "Unemployed", "Student"]
    },
    {
        id: "q16",
        question: "Do you have any years in current job?",
        type: "number"
    },
    {
        id: "q17",
        question: "Do you have any income steady?",
        type: "select",
        options: ["Yes", "No"]
    },
    {
        id: "q18",
        question: "Do you have any guarantor for someone else's loan?",
        type: "select",
        options: ["Yes", "No"]
    }
];

const getQuestionaire = asyncHandler(async (req, res) => {
    // Get all questions from the database
    let questions = await Questionaire.find({})
        .select("-__v")
        .lean();

    // If no questions found, use default questions
    if (!questions?.length) {
        questions = defaultQuestions;
    }

    return res.status(200).json(
        new ApiResponse(
            200, 
            questions, 
            questions === defaultQuestions ? "Default questions retrieved" : "Questions retrieved successfully"
        )
    );
});

export const getCurrentQuestionnaire = async (req, res) => {
    try {
        console.log("Getting questionnaire for user:", req.user._id);
        
        const userId = req.user._id;
        const user = await User.findById(userId);
        console.log("Found user:", user ? "Yes" : "No");

        // Return all questions in the desired format
        const questions = [
            {
                question: "What is your age?",
                answer: "",
                options: ["18-25", "26-35", "36-45", "46-55", "56+"]
            },
            {
                question: "What is your gender?",
                answer: "",
                options: ["Male", "Female", "Other", "Prefer not to say"]
            },
            {
                question: "What is your monthly income?",
                answer: "",
                options: ["Less than ₹25,000", "₹25,000-₹50,000", "₹50,001-₹75,000", "₹75,001-₹1,00,000", "More than ₹1,00,000"]
            },
            {
                question: "Do you have any existing loans?",
                answer: "",
                options: ["Yes", "No"]
            },
            {
                question: "What is the total outstanding loan amount?",
                answer: "",
                options: ["Less than ₹5,00,000", "₹5,00,000-₹20,00,000", "₹20,00,001-₹50,00,000", "More than ₹50,00,000"]
            },
            {
                question: "What percentage of monthly income do you spend on debts?",
                answer: "",
                options: ["0-20%", "21-40%", "41-60%", "More than 60%"]
            },
            {
                question: "Do you have any credit card debt?",
                answer: "",
                options: ["Yes", "No"]
            },
            {
                question: "Do you have any other sources of income?",
                answer: "",
                options: ["Yes", "No"]
            },
            {
                question: "Are you currently employed?",
                answer: "",
                options: ["Yes", "No"]
            },
            {
                question: "What is your employment type?",
                answer: "",
                options: ["Government Job", "Private Sector", "Business Owner", "Self-employed Professional", "Retired", "Unemployed"]
            },
            {
                question: "How many years have you been in your current job/business?",
                answer: "",
                options: ["Less than 1 year", "1-3 years", "4-7 years", "8-10 years", "More than 10 years"]
            },
            {
                question: "Is your income steady and consistent?",
                answer: "",
                options: ["Yes", "No"]
            },
            {
                question: "What is your CIBIL score?",
                answer: "",
                options: ["Below 600", "600-699", "700-749", "750-799", "800+", "Don't know"]
            },
            {
                question: "Do you own any property?",
                answer: "",
                options: ["Yes", "No"]
            },
            {
                question: "Do you have any investments?",
                answer: "",
                options: ["Fixed Deposits", "Mutual Funds", "Stocks", "Real Estate", "Gold", "None"]
            },
            {
                question: "What is the total amount of your savings?",
                answer: "",
                options: ["Less than ₹1,00,000", "₹1,00,000-₹5,00,000", "₹5,00,001-₹10,00,000", "₹10,00,001-₹25,00,000", "More than ₹25,00,000"]
            },
            {
                question: "Do you have any financial disputes or bankruptcies in the last 5 years?",
                answer: "",
                options: ["Yes", "No"]
            },
            {
                question: "Do you have any guarantor for someone else's loan?",
                answer: "",
                options: ["Yes", "No"]
            }
        ];

        return res.json({
            success: true,
            data: questions
        });

    } catch (error) {
        console.error("Questionnaire error:", {
            message: error.message,
            stack: error.stack
        });
        return res.status(500).json({
            success: false,
            message: "Failed to fetch questionnaire",
            error: error.message
        });
    }
};

export const submitQuestionnaire = async (req, res) => {
    try {
        const { answers } = req.body;
        const userId = req.user._id;

        const questionnaire = await Questionaire.create({
            userId,
            status: 'completed',
            answers,
            completedAt: new Date()
        });

        return res.json({
            success: true,
            message: "Questionnaire submitted successfully",
            data: questionnaire
        });
    } catch (error) {
        console.error("Submit error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to submit questionnaire"
        });
    }
};

export const getStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    const pendingQuestionnaire = await Questionaire.findOne({ 
      userId, 
      status: 'pending' 
    });

    return res.json({
      isComplete: user.isQuestionnaireComplete,
      pendingQuestionnaireId: pendingQuestionnaire?._id
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch status"
    });
  }
};

export {register,login,logout,updateQuestionaire,getUser,getQuestionaire};




// export {register,login,logout,getProfile,forgot,reset,updateAccountDetails,changeCurrentPassword,getCurrentUser};-----------




