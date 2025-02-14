"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

interface Question {
  question: string
  answer: string
  options?: string[]
}

interface SurveyFormProps {
  questions: Question[]
  responses: { [key: string]: string | string[] }
  onInputChange: (question: string, value: string) => void
  onCheckboxChange: (question: string, option: string) => void
  onSubmit: () => void
}

const SurveyForm: React.FC<SurveyFormProps> = ({ questions, responses, onInputChange, onCheckboxChange, onSubmit }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const totalQuestions = questions.length
  const answeredQuestions = Object.keys(responses).length
  const currentQuestion = questions[currentIndex]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange(currentQuestion.question, e.target.value)
  }

  const handleOptionClick = (option: string) => {
    onCheckboxChange(currentQuestion.question, option)
    // Automatically move to next question after selection
    if (currentIndex < totalQuestions - 1) {
      setTimeout(() => setCurrentIndex((prev) => prev + 1), 300)
    }
  }

  const nextQuestion = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }

  const getBackgroundColor = (index: number) => {
    const colors = ["bg-blue-100", "bg-green-100", "bg-yellow-100", "bg-pink-100", "bg-purple-100"]
    return colors[index % colors.length]
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-lg mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card
            className={`p-6 rounded-3xl shadow-lg relative min-h-[500px] flex flex-col ${getBackgroundColor(currentIndex)}`}
          >
            {/* Profile header */}
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <img src="/your-avatar.png" alt="Profile" className="w-8 h-8 rounded-full" />
              </motion.div>
              <div>
                <h3 className="font-semibold text-gray-900">Financial Assessment</h3>
                <p className="text-sm text-gray-700">
                  {answeredQuestions} of {totalQuestions} Answered
                </p>
              </div>
            </div>

            {/* Progress dots */}
            <div className="flex gap-1.5 mb-8">
              {questions.map((_, idx) => (
                <motion.div
                  key={idx}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? "bg-black" : idx < currentIndex ? "bg-gray-700" : "bg-gray-400/30"
                  }`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                />
              ))}
            </div>

            {/* Question */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="flex-grow"
              >
                <h2 className="text-xl font-bold mb-6 text-gray-900">
                  {currentQuestion.question}
                  <span className="text-red-500">*</span>
                </h2>

                <div className="space-y-3">
                  {currentQuestion.options ? (
                    // Options as buttons
                    <div className="space-y-2.5">
                      {currentQuestion.options.map((option, index) => (
                        <motion.button
                          key={option}
                          onClick={() => handleOptionClick(option)}
                          className={`w-full p-3.5 text-left rounded-xl border-2 transition-all
                            ${
                              (responses[currentQuestion.question] as string[])?.includes(option)
                                ? "bg-white border-gray-800 text-gray-900"
                                : "bg-white/80 border-transparent hover:bg-white text-gray-800"
                            }
                            focus:outline-none focus:ring-2 focus:ring-gray-800/20`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {option}
                        </motion.button>
                      ))}
                    </div>
                  ) : (
                    // Input field
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Input
                        type="text"
                        placeholder="Type your answer"
                        value={(responses[currentQuestion.question] as string) || ""}
                        onChange={handleInputChange}
                        className="w-full p-3.5 rounded-xl border-2 border-transparent
                          bg-white/80 placeholder:text-gray-500 text-gray-900
                          focus:border-gray-800 focus:bg-white focus:ring-2 focus:ring-gray-800/20"
                      />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-6">
              <div className="flex items-center gap-2">
                <img src="/told-logo.png" alt="Told" className="h-6" />
              </div>
              <div className="flex gap-3">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    onClick={prevQuestion}
                    disabled={currentIndex === 0}
                    className="text-gray-700 hover:text-gray-900 hover:bg-white/50 disabled:opacity-50"
                  >
                    Previous
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={currentIndex === totalQuestions - 1 ? onSubmit : nextQuestion}
                    className="bg-black hover:bg-gray-800 text-white rounded-full px-6
                      transition-all duration-200"
                  >
                    {currentIndex === totalQuestions - 1 ? "Submit" : "Next"}
                  </Button>
                </motion.div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default SurveyForm

