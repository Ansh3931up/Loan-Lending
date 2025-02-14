"use client"

import { useState, useEffect } from "react";
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import { authService, questionnaireService } from '@/services/auth.service';
import toast from 'react-hot-toast';
import SurveyForm from "@/components/questionaire";

export default function QuestionnairePage() {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [responses, setResponses] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        setLoading(true);
        const userResponse = await authService.getUser();
        if (userResponse.success) {
          setUserData(userResponse.data);
          const questionResponse = await questionnaireService.getQuestionnaire();
          console.log("Question Response:", questionResponse);
          
          if (questionResponse.success) {
            setQuestions(questionResponse.data);
          } else {
            toast.error('Failed to fetch questionnaire');
          }
        } else {
          router.push('/auth/login');
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Authentication failed');
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchData();
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await questionnaireService.submitQuestionnaire(responses);
      if (response.success) {
        toast.success('Questionnaire submitted successfully!');
        router.push('/dashboard');
      } else {
        toast.error('Failed to submit questionnaire');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Failed to submit questionnaire');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!userData || !questions.length) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-600">No questionnaire data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SurveyForm
        questions={questions}
        responses={responses}
        onInputChange={(question, value) => {
          setResponses(prev => ({
            ...prev,
            [question]: value
          }));
        }}
        onCheckboxChange={(question, option) => {
          setResponses(prev => ({
            ...prev,
            [question]: option
          }));
        }}
        onSubmit={handleSubmit}
        userData={userData}
      />
    </div>
  );
}