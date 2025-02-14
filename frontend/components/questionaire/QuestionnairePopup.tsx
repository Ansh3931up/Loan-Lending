'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { questionnaireService } from '@/services/auth.service';

export default function QuestionnairePopup() {
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkQuestionnaireStatus();
  }, []);

  const checkQuestionnaireStatus = async () => {
    const response = await questionnaireService.getStatus();
    if (response.success && !response.isComplete) {
      setShowPopup(true);
    }
  };

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Complete Your Survey</h2>
        <p className="text-gray-600 mb-6">
          Please complete your survey to help us serve you better.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setShowPopup(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Later
          </button>
          <button
            onClick={() => router.push('/questionaire')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Continue Survey
          </button>
        </div>
      </div>
    </div>
  );
}
