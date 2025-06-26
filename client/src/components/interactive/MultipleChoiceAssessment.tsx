import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';

interface ChoiceOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  question: string;
  type: 'single' | 'multiple';
  options: ChoiceOption[];
  explanation?: string;
}

interface MultipleChoiceAssessmentProps {
  title: string;
  questions: Question[];
  onComplete?: (score: number, totalQuestions: number) => void;
  showExplanations?: boolean;
  className?: string;
  instanceId?: string; // Unique identifier for this component instance
}

export function MultipleChoiceAssessment({
  title,
  questions,
  onComplete,
  showExplanations = true,
  className = '',
  instanceId = 'default'
}: MultipleChoiceAssessmentProps) {
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // Reset state when instanceId changes (different component instance)
  const [currentInstanceId, setCurrentInstanceId] = useState(instanceId);
  if (currentInstanceId !== instanceId) {
    setAnswers({});
    setSubmitted(false);
    setShowFeedback(false);
    setCurrentInstanceId(instanceId);
  }

  const handleOptionSelect = (questionId: string, optionId: string) => {
    if (submitted) return;

    const question = questions.find(q => q.id === questionId);
    if (!question) return;

    setAnswers(prev => {
      const newAnswers = { ...prev };
      
      if (question.type === 'single') {
        // Single selection - replace existing answer
        newAnswers[questionId] = [optionId];
      } else {
        // Multiple selection - toggle option
        const currentAnswers = newAnswers[questionId] || [];
        if (currentAnswers.includes(optionId)) {
          newAnswers[questionId] = currentAnswers.filter(id => id !== optionId);
        } else {
          newAnswers[questionId] = [...currentAnswers, optionId];
        }
      }
      
      return newAnswers;
    });
  };

  const isOptionSelected = (questionId: string, optionId: string) => {
    return answers[questionId]?.includes(optionId) || false;
  };

  const checkAnswers = () => {
    setSubmitted(true);
    setShowFeedback(true);

    let correctCount = 0;
    
    questions.forEach(question => {
      const userAnswers = answers[question.id] || [];
      const correctAnswers = question.options
        .filter(option => option.isCorrect)
        .map(option => option.id);

      // Check if answers match exactly
      const isCorrect = userAnswers.length === correctAnswers.length &&
        userAnswers.every(answer => correctAnswers.includes(answer));

      if (isCorrect) {
        correctCount++;
      }
    });

    onComplete?.(correctCount, questions.length);
  };

  const resetAssessment = () => {
    setAnswers({});
    setSubmitted(false);
    setShowFeedback(false);
  };

  const getOptionFeedback = (questionId: string, optionId: string) => {
    if (!submitted) return null;

    const question = questions.find(q => q.id === questionId);
    const option = question?.options.find(o => o.id === optionId);
    const isSelected = isOptionSelected(questionId, optionId);

    if (!option) return null;

    if (option.isCorrect && isSelected) {
      return { type: 'correct', icon: <CheckCircle className="h-4 w-4 text-green-600" /> };
    } else if (option.isCorrect && !isSelected) {
      return { type: 'missed', icon: <CheckCircle className="h-4 w-4 text-green-600" /> };
    } else if (!option.isCorrect && isSelected) {
      return { type: 'wrong', icon: <XCircle className="h-4 w-4 text-red-600" /> };
    }

    return null;
  };

  const getQuestionScore = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (!question || !submitted) return null;

    const userAnswers = answers[questionId] || [];
    const correctAnswers = question.options
      .filter(option => option.isCorrect)
      .map(option => option.id);

    const isCorrect = userAnswers.length === correctAnswers.length &&
      userAnswers.every(answer => correctAnswers.includes(answer));

    return isCorrect;
  };

  const allQuestionsAnswered = Array.isArray(questions) && questions.every(question => 
    answers[question.id] && answers[question.id].length > 0
  );

  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600">
            Choose the {Array.isArray(questions) && questions.some(q => q.type === 'multiple') ? 'best answer(s)' : 'best answer'} for each question.
          </p>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {Array.isArray(questions) && questions.map((question, questionIndex) => {
            const questionScore = getQuestionScore(question.id);
            
            return (
              <Card key={question.id} className="p-5 bg-gray-50">
                <div className="space-y-4">
                  {/* Question Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Question {questionIndex + 1}
                        {question.type === 'multiple' && (
                          <span className="text-sm font-normal text-gray-600 ml-2">
                            (Select all that apply)
                          </span>
                        )}
                      </h4>
                      <p className="text-gray-700">{question.question}</p>
                    </div>
                    {submitted && questionScore !== null && (
                      <div className="ml-4">
                        {questionScore ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Options */}
                  <div className="space-y-2">
                    {question.options.map((option) => {
                      const isSelected = isOptionSelected(question.id, option.id);
                      const feedback = getOptionFeedback(question.id, option.id);
                      
                      return (
                        <button
                          key={option.id}
                          onClick={() => handleOptionSelect(question.id, option.id)}
                          disabled={submitted}
                          className={`
                            w-full text-left p-3 rounded-lg border-2 transition-all duration-200
                            flex items-center justify-between
                            ${submitted ? 'cursor-default' : 'cursor-pointer hover:bg-white'}
                            ${isSelected 
                              ? submitted 
                                ? feedback?.type === 'correct' 
                                  ? 'border-green-300 bg-green-50' 
                                  : feedback?.type === 'wrong'
                                  ? 'border-red-300 bg-red-50'
                                  : 'border-blue-300 bg-blue-50'
                                : 'border-blue-300 bg-blue-50'
                              : submitted && feedback?.type === 'missed'
                              ? 'border-green-300 bg-green-50'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                            }
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`
                              w-4 h-4 rounded border-2 flex items-center justify-center
                              ${question.type === 'multiple' ? '' : 'rounded-full'}
                              ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}
                            `}>
                              {isSelected && (
                                <div className={`
                                  w-2 h-2 bg-white rounded
                                  ${question.type === 'multiple' ? '' : 'rounded-full'}
                                `} />
                              )}
                            </div>
                            <span className="text-gray-800">{option.text}</span>
                          </div>
                          {feedback?.icon}
                        </button>
                      );
                    })}
                  </div>

                  {/* Question Explanation */}
                  {submitted && showExplanations && question.explanation && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Explanation:</strong> {question.explanation}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center pt-4">
          <Button
            onClick={resetAssessment}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          
          <Button
            onClick={checkAnswers}
            disabled={submitted || !allQuestionsAnswered}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {submitted ? 'Submitted' : 'Submit Answers'}
          </Button>
        </div>

        {/* Overall Feedback */}
        {showFeedback && (
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="text-center">
              <h4 className="font-semibold text-blue-900 mb-2">Assessment Results</h4>
              <p className="text-blue-800">
                You scored {questions.filter(q => getQuestionScore(q.id)).length} out of {questions.length} questions correctly!
              </p>
              <div className="mt-2">
                <div className="text-sm text-blue-700">
                  Score: {Math.round((questions.filter(q => getQuestionScore(q.id)).length / questions.length) * 100)}%
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Card>
  );
}