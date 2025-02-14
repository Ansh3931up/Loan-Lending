import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
    questionId: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    }
}, { _id: false });

const questionnaireSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
    },
    answers: [answerSchema],
    currentQuestionIndex: {
        type: Number,
        default: 0
    },
    completedAt: {
        type: Date,
        default: null
    },
    age: {
        type: Number,
        default: null
    },
    gender: {
        type: String,
        default: null
    },
    monthlyIncome: {
        type: Number,
        default: null
    },
    existingLoans: {
        type: Boolean,
        default: null
    },
    outstandingLoanAmount: {
        type: Number,
        default: null
    },
    debtPercentage: {
        type: Number,
        default: null
    },
    creditCardDebt: {
        type: Number,
        default: null
    },
    otherIncomeSources: {
        type: Boolean,
        default: null
    },
    employmentStatus: {
        type: String,
        default: null
    },
    employmentType: {
        type: String,
        default: null
    },
    yearsInCurrentJob: {
        type: Number,
        default: null
    },
    incomeSteady: {
        type: Boolean,
        default: null
    },
    cibilScore: {
        type: Number,
        default: null
    },
    propertyOwnership: {
        type: Boolean,
        default: null
    },
    investments: {
        type: Number,
        default: null
    },
    savingsAmount: {
        type: Number,
        default: null
    },
    financialDisputes: {
        type: Boolean,
        default: null
    },
    guarantor: {
        type: Boolean,
        default: null
    },
}, {
    timestamps: true
});

const Questionnaire = mongoose.model("Questionnaire", questionnaireSchema);
export default Questionnaire;
