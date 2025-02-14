interface Question {
  question: string;
  answer: string;
  options?: string[];
}

export const questionaire: Question[] = [
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
      
]