'use client'

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Brain, ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Question {
  id: number
  text: string
  options: {
    text: string
    score: number // Hidden from UI
  }[]
}

const questions: Question[] = [
  {
    id: 1,
    text: "What do you do when you receive a ₹1,00,000 bonus?",
    options: [
      { text: "Save it for future emergencies", score: 1 },
      { text: "Invest in mutual funds or fixed deposits", score: 2 },
      { text: "Use it for high-growth opportunities like stocks or startups", score: 3 }
    ]
  },
  {
    id: 2,
    text: "Your car suddenly needs repairs costing ₹50,000. How do you handle it?",
    options: [
      { text: "Use money from your emergency savings", score: 1 },
      { text: "Use your credit card and pay in installments", score: 2 },
      { text: "Take a short-term loan to cover it", score: 3 }
    ]
  },
  {
    id: 3,
    text: "A friend offers a chance to invest ₹2,00,000 in a new business. What do you do?",
    options: [
      { text: "Decline the offer as businesses are risky", score: 1 },
      { text: "Invest ₹50,000 after researching", score: 2 },
      { text: "Go all in and invest the full ₹2,00,000", score: 3 }
    ]
  },
  {
    id: 4,
    text: "The stock market crashes while you have ₹5,00,000 invested. What do you do?",
    options: [
      { text: "Withdraw all investments to prevent losses", score: 1 },
      { text: "Hold the stocks and wait for recovery", score: 2 },
      { text: "Buy more stocks while prices are low", score: 3 }
    ]
  },
  {
    id: 5,
    text: "You have an ongoing loan, and you receive a ₹50,000 bonus. What do you do?",
    options: [
      { text: "Use the bonus to pay off part of the loan", score: 1 },
      { text: "Split between savings and EMI payments", score: 2 },
      { text: "Spend it on a vacation and continue paying EMIs normally", score: 3 }
    ]
  }
]

export default function RiskAssessment({ onComplete }: { onComplete: (score: number) => void }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [selectedOption, setSelectedOption] = useState<number | null>(null)

  const handleNext = () => {
    if (selectedOption !== null) {
      const newAnswers = [...answers, selectedOption]
      setAnswers(newAnswers)
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedOption(null)
      } else {
        // Calculate final score and complete assessment
        const totalScore = newAnswers.reduce((acc, curr) => acc + curr, 0)
        onComplete(totalScore)
      }
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setSelectedOption(answers[currentQuestion - 1])
      setAnswers(answers.slice(0, -1))
    }
  }

  return (
    <div className="space-y-8">
      {/* Progress Indicator */}
      <div className="flex items-center gap-3">
        <Brain className="h-5 w-5 text-[#3cc7e5]" />
        <span className="text-sm text-gray-300">
          Question {currentQuestion + 1} of {questions.length}
        </span>
        <div className="flex-1 h-1 bg-gray-700 rounded-full ml-4">
          <div 
            className="h-full bg-[#3cc7e5] rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-8"
        >
          <h3 className="text-2xl text-white font-medium">
            {questions[currentQuestion].text}
          </h3>

          {/* Options */}
          <div className="space-y-4">
            {questions[currentQuestion].options.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  onClick={() => setSelectedOption(option.score)}
                  className={`w-full p-4 text-left rounded-lg border transition-all
                    ${selectedOption === option.score
                      ? 'border-[#3cc7e5] bg-[#1e2533]'
                      : 'border-gray-700 bg-[#1e2533] hover:border-[#3cc7e5]/50'
                    }
                    text-white`}
                >
                  {option.text}
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="space-y-4">
        <div className="flex justify-between">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="text-gray-400 hover:text-white hover:bg-transparent"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={selectedOption === null}
            className="bg-[#3cc7e5] hover:bg-[#3cc7e5]/90 text-white px-8 rounded-md"
          >
            {currentQuestion === questions.length - 1 ? 'Submit Application' : 'Next'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
