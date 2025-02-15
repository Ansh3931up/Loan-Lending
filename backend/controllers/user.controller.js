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
        question: "What is your monthly income (Applicant)?",
        type: "number"
    },
    {
        id: "q2",
        question: "What is the co-applicant's monthly income?",
        type: "number"
    },
    {
        id: "q3",
        question: "What loan amount are you looking for?",
        type: "number"
    },
    {
        id: "q4",
        question: "What loan amount term (in months) are you looking for?",
        type: "number"
    },
    {
        id: "q5",
        question: "What is your credit history?",
        type: "number"
    },
    {
        id: "q6",
        question: "What is your gender?",
        type: "select",
        options: ["Male", "Female"]
    },
    {
        id: "q7",
        question: "Are you married?",
        type: "select",
        options: ["Yes", "No"]
    },
    {
        id: "q8",
        question: "How many dependents do you have?",
        type: "select",
        options: ["0", "1", "2", "3+"]
    },
    {
        id: "q9",
        question: "What is your education level?",
        type: "select",
        options: ["Graduate", "Not Graduate"]
    },
    {
        id: "q10",
        question: "Are you self employed?",
        type: "select",
        options: ["Yes", "No"]
    },
    {
        id: "q11",
        question: "What type of property area do you live in?",
        type: "select",
        options: ["Urban", "Rural"]
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
        // const questions = [
        //     {
        //         question: "What is your age?",
        //         answer: "",
        //         options: ["18-25", "26-35", "36-45", "46-55", "56+"]
        //     },
        //     {
        //         question: "What is your gender?",
        //         answer: "",
        //         options: ["Male", "Female", "Other", "Prefer not to say"]
        //     },
        //     {
        //         question: "What is your monthly income?",
        //         answer: "",
        //         options: ["Less than ₹25,000", "₹25,000-₹50,000", "₹50,001-₹75,000", "₹75,001-₹1,00,000", "More than ₹1,00,000"]
        //     },
        //     {
        //         question: "Do you have any existing loans?",
        //         answer: "",
        //         options: ["Yes", "No"]
        //     },
        //     {
        //         question: "What is the total outstanding loan amount?",
        //         answer: "",
        //         options: ["Less than ₹5,00,000", "₹5,00,000-₹20,00,000", "₹20,00,001-₹50,00,000", "More than ₹50,00,000"]
        //     },
        //     {
        //         question: "What percentage of monthly income do you spend on debts?",
        //         answer: "",
        //         options: ["0-20%", "21-40%", "41-60%", "More than 60%"]
        //     },
        //     {
        //         question: "Do you have any credit card debt?",
        //         answer: "",
        //         options: ["Yes", "No"]
        //     },
        //     {
        //         question: "Do you have any other sources of income?",
        //         answer: "",
        //         options: ["Yes", "No"]
        //     },
        //     {
        //         question: "Are you currently employed?",
        //         answer: "",
        //         options: ["Yes", "No"]
        //     },
        //     {
        //         question: "What is your employment type?",
        //         answer: "",
        //         options: ["Government Job", "Private Sector", "Business Owner", "Self-employed Professional", "Retired", "Unemployed"]
        //     },
        //     {
        //         question: "How many years have you been in your current job/business?",
        //         answer: "",
        //         options: ["Less than 1 year", "1-3 years", "4-7 years", "8-10 years", "More than 10 years"]
        //     },
        //     {
        //         question: "Is your income steady and consistent?",
        //         answer: "",
        //         options: ["Yes", "No"]
        //     },
        //     {
        //         question: "What is your CIBIL score?",
        //         answer: "",
        //         options: ["Below 600", "600-699", "700-749", "750-799", "800+", "Don't know"]
        //     },
        //     {
        //         question: "Do you own any property?",
        //         answer: "",
        //         options: ["Yes", "No"]
        //     },
        //     {
        //         question: "Do you have any investments?",
        //         answer: "",
        //         options: ["Fixed Deposits", "Mutual Funds", "Stocks", "Real Estate", "Gold", "None"]
        //     },
        //     {
        //         question: "What is the total amount of your savings?",
        //         answer: "",
        //         options: ["Less than ₹1,00,000", "₹1,00,000-₹5,00,000", "₹5,00,001-₹10,00,000", "₹10,00,001-₹25,00,000", "More than ₹25,00,000"]
        //     },
        //     {
        //         question: "Do you have any financial disputes or bankruptcies in the last 5 years?",
        //         answer: "",
        //         options: ["Yes", "No"]
        //     },
        //     {
        //         question: "Do you have any guarantor for someone else's loan?",
        //         answer: "",
        //         options: ["Yes", "No"]
        //     }
        // ];

        const questions = defaultQuestions;

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
        console.log("Raw request body:", req.body);
        console.log("Extracted answers:", answers);
        console.log("User ID:", userId);

        // Validate answers array
        if (!Array.isArray(answers.answers) || answers.answers.length !== 11) {
            console.log("Validation failed - Array check:", {
                isArray: Array.isArray(answers.answers),
                length: answers.answers?.length
            });
            return res.status(400).json({
                success: false,
                message: "Invalid questionnaire format. All questions must be answered."
            });
        }

        // Create a mapping object to store the processed answers
        const processedAnswers = {
            userId,
            status: 'completed',
            completedAt: new Date(),
            answers:answers.answers,
            ApplicantIncome: null,
            CoapplicantIncome: null,
            LoanAmount: null,
            Loan_Amount_Term: null,
            Credit_History: null,
            Gender: null,
            Married: null,
            Dependents: null,
            Education: null,
            Self_Employed: null,
            Property_Area: null
        };

        console.log("Processing answers...");
        // Process answers and map them to the correct fields
        answers.answers?.forEach((answer, index) => {
            console.log(`Processing answer ${index + 1}:`, answer);
            
            if (!answer.questionId || answer.answer === undefined) {
                console.error("Invalid answer format:", answer);
                throw new Error(`Invalid answer format for question: ${JSON.stringify(answer)}`);
            }

            switch (answer.questionId) {
                case 'q1':
                    processedAnswers.ApplicantIncome = Number(answer.answer) * 1000;
                    console.log("Set ApplicantIncome:", processedAnswers.ApplicantIncome);
                    break;
                case 'q2':
                    processedAnswers.CoapplicantIncome = Number(answer.answer) * 1000;
                    console.log("Set CoapplicantIncome:", processedAnswers.CoapplicantIncome);
                    break;
                case 'q3':
                    processedAnswers.LoanAmount = Number(answer.answer) * 1000;
                    console.log("Set LoanAmount:", processedAnswers.LoanAmount);
                    break;
                case 'q4':
                    processedAnswers.Loan_Amount_Term = Number(answer.answer);
                    console.log("Set Loan_Amount_Term:", processedAnswers.Loan_Amount_Term);
                    break;
                case 'q5':
                    processedAnswers.Credit_History = Number(answer.answer) > 0 ? 1 : 0;
                    console.log("Set Credit_History:", processedAnswers.Credit_History);
                    break;
                case 'q6':
                    processedAnswers.Gender = answer.answer;
                    console.log("Set Gender:", processedAnswers.Gender);
                    break;
                case 'q7':
                    processedAnswers.Married = answer.answer;
                    console.log("Set Married:", processedAnswers.Married);
                    break;
                case 'q8':
                    processedAnswers.Dependents = answer.answer === '3+' ? '3' : answer.answer;
                    console.log("Set Dependents:", processedAnswers.Dependents);
                    break;
                case 'q9':
                    processedAnswers.Education = answer.answer;
                    console.log("Set Education:", processedAnswers.Education);
                    break;
                case 'q10':
                    processedAnswers.Self_Employed = answer.answer;
                    console.log("Set Self_Employed:", processedAnswers.Self_Employed);
                    break;
                case 'q11':
                    processedAnswers.Property_Area = answer.answer;
                    console.log("Set Property_Area:", processedAnswers.Property_Area);
                    break;
                default:
                    console.warn(`Unknown question ID: ${answer.questionId}`);
            }
        });

        console.log("Final processed answers:", processedAnswers);

        // Validate processed answers
        const requiredFields = [
            'ApplicantIncome', 'CoapplicantIncome', 'LoanAmount', 
            'Loan_Amount_Term', 'Credit_History', 'Gender', 'Married',
            'Dependents', 'Education', 'Self_Employed', 'Property_Area'
        ];

        const missingFields = requiredFields.filter(field => 
            processedAnswers[field] === null || processedAnswers[field] === undefined
        );

        if (missingFields.length > 0) {
            console.error("Missing required fields:", missingFields);
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        console.log("Creating questionnaire in database...");
        const questionnaire = await Questionaire.create(processedAnswers);
        console.log("Questionnaire created successfully:", questionnaire);

        return res.json({
            success: true,
            message: "Questionnaire submitted successfully",
            data: questionnaire
        });
    } catch (error) {
        console.error("Submit error:", {
            message: error.message,
            stack: error.stack
        });
        return res.status(500).json({
            success: false,
            message: "Failed to submit questionnaire",
            error: error.message
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




