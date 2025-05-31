import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Clock, PlayCircle, HelpCircle } from 'lucide-react';
import { QuizComponent } from '@/components/QuizComponent';
import { propsInDetailContent } from './content';

export function PropsInDetailPage() {
  const content = propsInDetailContent;
  const [activeTab, setActiveTab] = useState('overview');
  const [showQuiz, setShowQuiz] = useState(false);

  const handleQuizComplete = (score: number) => {
    console.log('Quiz completed with score:', score);
    // Handle quiz completion
  };

  if (showQuiz && content.quiz) {
    return (
      <div className="p-6 flex-1">
        <QuizComponent content={content} onComplete={handleQuizComplete} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Lesson Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-primary">Module 2 • Activity 2</span>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500">22 min</span>
          </div>
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">{content.title}</h1>
        <p className="text-sm text-gray-600">{content.description}</p>
      </div>

      {/* Content Tabs */}
      <div className="border-b border-gray-200">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start px-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transcript">Transcript</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="quiz">
              <HelpCircle className="w-4 h-4 mr-1" />
              Quiz
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <Tabs value={activeTab} className="w-full">
          <TabsContent value="overview" className="space-y-6 mt-0">
            {/* Learning Objectives */}
            {content.objectives && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Learning Objectives</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {content.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Content Sections */}
            {content.content && (
              <div className="space-y-6">
                {content.content.map((section, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      {section.title && (
                        <h3 className="font-semibold text-lg text-gray-900 mb-3">{section.title}</h3>
                      )}
                      
                      {section.type === 'text' && (
                        <p className="text-gray-700 leading-relaxed">{section.content}</p>
                      )}
                      
                      {section.type === 'code' && (
                        <>
                          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto mb-3">
                            <code className="text-green-400 text-sm font-mono whitespace-pre">
                              {section.content}
                            </code>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {section.language || 'javascript'}
                            </Badge>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Practice Exercise */}
            <Card className="border-accent/20 bg-accent/5">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <PlayCircle className="w-5 h-5 text-accent" />
                  <h3 className="font-semibold text-accent-foreground">Practice Exercise</h3>
                </div>
                <p className="text-sm text-accent-foreground/80 mb-3">
                  Create a component that receives a user object as props and displays their information.
                </p>
                <Button variant="outline" className="text-accent border-accent hover:bg-accent hover:text-accent-foreground">
                  Start Exercise
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transcript" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Video Transcript</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm text-gray-700">
                  <p>
                    [00:00] Welcome back to our React course. In this lesson, we'll dive deep into props - 
                    one of the most fundamental concepts in React.
                  </p>
                  <p>
                    [00:15] Props, short for properties, are how we pass data from parent components to 
                    child components. Think of them as function arguments for your components.
                  </p>
                  <p>
                    [00:30] Let's start with a simple example. Here we have a Welcome component that 
                    receives a prop called 'name'...
                  </p>
                  <p className="text-gray-500 italic">
                    [Full transcript would continue here...]
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Additional Resources</CardTitle>
              </CardHeader>
              <CardContent>
                {content.resources && content.resources.length > 0 ? (
                  <div className="space-y-3">
                    {content.resources.map((resource, index) => (
                      <a
                        key={index}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            {resource.type === 'pdf' && <span className="text-red-500">📄</span>}
                            {resource.type === 'link' && <span className="text-blue-500">🔗</span>}
                          </div>
                          <div>
                            <div className="font-medium text-sm text-gray-900 group-hover:text-primary">
                              {resource.title}
                            </div>
                            <div className="text-xs text-gray-500 capitalize">
                              {resource.type}
                            </div>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No additional resources available.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quiz" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Test Your Knowledge</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Ready to test your understanding of props? This quiz will help reinforce what you've learned.
                </p>
                <Button onClick={() => setShowQuiz(true)} className="flex items-center space-x-2">
                  <HelpCircle className="w-4 h-4" />
                  <span>Start Quiz</span>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
