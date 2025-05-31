import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, ChevronRight, ChevronLeft } from 'lucide-react';
import { PageContent } from '@shared/schema';

interface QuizComponentProps {
  content: PageContent;
  onComplete: (score: number) => void;
}

interface QuizAnswer {
  questionId: string;
  answer: string | number;
  isCorrect: boolean;
}

export function QuizComponent({ content, onComplete }: QuizComponentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<QuizAnswer[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes
  const [isSubmitted, setIsSubmitted] = useState(false);

  const questions = content.quiz?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];

  // Timer countdown
  useEffect(() => {
    if (timeRemaining > 0 && !isSubmitted) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !isSubmitted) {
      handleSubmitQuiz();
    }
  }, [timeRemaining, isSubmitted]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = () => {
    const results: QuizAnswer[] = questions.map(question => {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;
      
      return {
        questionId: question.id,
        answer: userAnswer || '',
        isCorrect
      };
    });

    setSubmittedAnswers(results);
    setIsSubmitted(true);
    setShowResults(true);

    const score = Math.round((results.filter(r => r.isCorrect).length / questions.length) * 100);
    onComplete(score);
  };

  const getQuestionResult = (questionId: string) => {
    return submittedAnswers.find(answer => answer.questionId === questionId);
  };

  const getTotalScore = () => {
    if (submittedAnswers.length === 0) return 0;
    return Math.round((submittedAnswers.filter(a => a.isCorrect).length / submittedAnswers.length) * 100);
  };

  const getProgressPercentage = () => {
    return Math.round(((currentQuestionIndex + 1) / questions.length) * 100);
  };

  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-600">No quiz questions available.</p>
        </CardContent>
      </Card>
    );
  }

  if (showResults) {
    const score = getTotalScore();
    const correctAnswers = submittedAnswers.filter(a => a.isCorrect).length;

    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Quiz Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score Display */}
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold text-primary">{score}%</div>
            <p className="text-lg text-gray-600">
              {correctAnswers} out of {questions.length} correct
            </p>
            <Badge 
              variant={score >= 80 ? "default" : score >= 60 ? "secondary" : "destructive"}
              className="text-lg px-4 py-2"
            >
              {score >= 80 ? 'Excellent!' : score >= 60 ? 'Good Job!' : 'Keep Practicing!'}
            </Badge>
          </div>

          {/* Question Review */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Review Your Answers</h3>
            {questions.map((question, index) => {
              const result = getQuestionResult(question.id);
              const isCorrect = result?.isCorrect || false;

              return (
                <Card key={question.id} className={`border-l-4 ${
                  isCorrect ? 'border-l-green-500' : 'border-l-red-500'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium mb-2">
                          Question {index + 1}: {question.question}
                        </h4>
                        
                        {question.type === 'multiple-choice' && question.options && (
                          <div className="space-y-1">
                            {question.options.map((option, optionIndex) => {
                              const isUserAnswer = result?.answer === optionIndex;
                              const isCorrectAnswer = question.correctAnswer === optionIndex;
                              
                              return (
                                <div 
                                  key={optionIndex}
                                  className={`p-2 rounded ${
                                    isCorrectAnswer 
                                      ? 'bg-green-100 text-green-800' 
                                      : isUserAnswer && !isCorrectAnswer
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-gray-50'
                                  }`}
                                >
                                  <span className="font-medium">
                                    {String.fromCharCode(65 + optionIndex)})
                                  </span> {option}
                                  {isCorrectAnswer && (
                                    <Badge variant="outline" className="ml-2 text-green-700 border-green-700">
                                      Correct
                                    </Badge>
                                  )}
                                  {isUserAnswer && !isCorrectAnswer && (
                                    <Badge variant="outline" className="ml-2 text-red-700 border-red-700">
                                      Your Answer
                                    </Badge>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                        
                        {question.explanation && (
                          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                            <p className="text-blue-800 text-sm">
                              <strong>Explanation:</strong> {question.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Quiz Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Quiz Progress</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span className={timeRemaining < 60 ? 'text-red-600 font-medium' : ''}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>
          </div>
          <Progress value={getProgressPercentage()} className="mt-4" />
        </CardHeader>
      </Card>

      {/* Current Question */}
      <Card>
        <CardContent className="p-6 space-y-6">
          <div>
            <h2 className="text-xl font-medium text-gray-900 mb-4">
              {currentQuestion.question}
            </h2>
            
            {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
              <RadioGroup 
                value={answers[currentQuestion.id]?.toString() || ''} 
                onValueChange={handleAnswerChange}
                className="space-y-3"
              >
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      <span className="font-medium mr-3">
                        {String.fromCharCode(65 + index)})
                      </span>
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {currentQuestion.type === 'true-false' && (
              <RadioGroup 
                value={answers[currentQuestion.id]?.toString() || ''} 
                onValueChange={handleAnswerChange}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="true" id="true" />
                  <Label htmlFor="true" className="flex-1 cursor-pointer">True</Label>
                </div>
                <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="false" id="false" />
                  <Label htmlFor="false" className="flex-1 cursor-pointer">False</Label>
                </div>
              </RadioGroup>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </Button>

        <div className="flex items-center space-x-3">
          {currentQuestionIndex === questions.length - 1 ? (
            <Button 
              onClick={handleSubmitQuiz}
              disabled={Object.keys(answers).length !== questions.length}
              className="flex items-center space-x-2"
            >
              <span>Submit Quiz</span>
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!answers[currentQuestion.id]}
              className="flex items-center space-x-2"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Answer Summary */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-3">Answer Progress</h3>
          <div className="flex flex-wrap gap-2">
            {questions.map((question, index) => (
              <Button
                key={question.id}
                variant={currentQuestionIndex === index ? "default" : answers[question.id] ? "secondary" : "outline"}
                size="sm"
                onClick={() => setCurrentQuestionIndex(index)}
                className="w-10 h-10"
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
