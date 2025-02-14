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
    ApplicantIncome: {
        type: Number,
        default: null
    },
    CoapplicantIncome: {
        type: Number,
        default: null
    },
    LoanAmount: {
        type: Number,
        default: null
    },
    Loan_Amount_Term: {
        type: Number,
        default: null
    },
    Credit_History: {
        type: Number,
        default: null
    },
    Gender: {
        type: String,
        default: null
    },
    Married: {
        type: String,
        default: null
    },
    Dependents: {
        type: String,
        default: null
    },
    Education: {
        type: String,
        default: null
    },
    Self_Employed: {
        type: String,
        default: null
    },
    Property_Area: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

const Questionnaire = mongoose.model("Questionnaire", questionnaireSchema);
export default Questionnaire;
