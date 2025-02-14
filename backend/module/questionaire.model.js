import mongoose from "mongoose";

const questionaireSchema=new mongoose.Schema({
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    age: {
        type:Number,
        required:true,
    },
    gender: {
        type:String,
        required:true,
    },
    monthlyIncome: {
        type:String,
        required:true,
    },
    existingLoans: {
        type:Boolean,
        required:true,
    },
    outstandingLoanAmount: {
        type:String,
        required:true,
    },
    debtPercentage: {
        type:String,
        required:true,
    },
    creditCardDebt: {
        type:Boolean,
        required:true,
    },
    otherIncomeSources: {
        type:Boolean,
        required:true,
    },
    employmentStatus: {
        type:String,
        required:true,
    }, 
    employmentType: {
        type:String,
        required:true,
    },
    yearsInCurrentJob: {
        type:String,
        required:true,
    },
    incomeSteady: {
        type:Boolean,
        required:true,
    },
    creditCardDebt: {
        type:Boolean,
        required:true,
    },
    cibilScore: {
        type:Number,
        required:true,
    },
    propertyOwnership: {
        type:Boolean,
        required:true,
    },
    investments: {
        type:String,
        required:true,
    },
    savingsAmount: {
        type:String,
        required:true,
    },
    financialDisputes: {
        type:Boolean,
        required:true,
    },
    guarantor: {
        type:Boolean,
        required:true,
    },
})

const Questionaire=mongoose.model("Questionaire",questionaireSchema);
export default Questionaire;
