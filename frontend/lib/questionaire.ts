interface Question {
  id: string;
  question: string;
  type: "number" | "select";
  options?: string[];
}

export const questionaire: Question[] = [
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