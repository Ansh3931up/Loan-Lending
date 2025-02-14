"use client";

import { useState } from "react";
import SurveyForm from "@/components/questionaire";
import { Button } from "@/components/ui/button";
import {api} from "@/lib/axios"
import { questionaire } from "@/lib/questionaire";

// Define type for survey responses
type SurveyResponse = {
  [key: string]: string | string[];
};

// Define type for question structure to match questionaire.ts
interface Question {
  question: string;
  answer: string;
  options?: string[];
}

export default function Page() {
  const [responses, setResponses] = useState<SurveyResponse>({});

  const handleSingleInputChange = (question: string, value: string) => {
    setResponses((prev) => ({ ...prev, [question]: value }));
  };

  const handleMultipleChoiceChange = (question: string, option: string) => {
    setResponses((prev) => {
      const selectedOptions = new Set(prev[question] as string[] || []);
      selectedOptions.has(option) 
        ? selectedOptions.delete(option)
        : selectedOptions.add(option);
      return { ...prev, [question]: Array.from(selectedOptions) };
    });
  };

  const handleSubmit = async () => {
    try {
      // TODO: Add API call to save responses
      console.log("Survey Responses:", responses);
      const formattedResponses = {
        age: responses["What is your age?"][0],
        gender: responses["What is your gender?"][0],
        monthlyIncome: responses["What is your monthly income?"][0],
        existingLoans: responses["Do you have any existing loans?"][0] === "Yes",
        outstandingLoanAmount: responses["What is the total outstanding loan amount?"][0],
        debtPercentage: responses["What percentage of monthly income do you spend on debts?"][0],
        creditCardDebt: responses["Do you have any credit card debt?"][0] === "Yes",
        otherIncomeSources: responses["Do you have any other sources of income?"][0] === "Yes",
        employmentStatus: responses["Are you currently employed?"][0] === "Yes",
        employmentType: responses["What is your employment type?"][0],
        yearsInCurrentJob: responses["How many years have you been in your current job/business?"][0],
        incomeSteady: responses["Is your income steady and consistent?"][0] === "Yes",
        cibilScore: parseInt(responses["What is your CIBIL score?"][0]),
        propertyOwnership: responses["Do you own any property?"][0] === "Yes",
        investments: responses["Do you have any investments?"][0],
        savingsAmount: responses["What is the total amount of your savings?"][0],
        financialDisputes: responses["Do you have any financial disputes or bankruptcies in the last 5 years?"][0] === "Yes",
        guarantor: responses["Do you have any guarantor for someone else's loan?"][0] === "Yes"
      };

      const response = await fetch("/api/v1/user/updateQuestionaire", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedResponses),
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error("Failed to submit questionnaire");
      }
      // Clear form after successful submission
      setResponses({});
    } catch (error) {
      console.error("Error submitting survey:", error);
    }
  };

  return (
    <div className="min-h-screen">
      <SurveyForm 
        questions={questionaire as Question[]}
        responses={responses}
        onInputChange={handleSingleInputChange}
        onCheckboxChange={handleMultipleChoiceChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
}