import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, FileText, ExternalLink, Download } from 'lucide-react';
import { whatIsReactContent } from './content';

export function WhatIsReactPage() {
  const content = whatIsReactContent;

  return (
    <div className="p-6 flex-1 overflow-y-auto">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-primary">Module 1 • Activity 1</span>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500">15 min</span>
          </div>
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">{content.title}</h1>
        <p className="text-sm text-gray-600">{content.description}</p>
      </div>

      {/* Learning Objectives */}
      {content.objectives && (
        <Card className="mb-6">
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
        <div className="space-y-6 mb-6">
          {content.content.map((section, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                {section.title && (
                  <h3 className="font-semibold text-lg text-gray-900 mb-3">{section.title}</h3>
                )}
                
                {section.type === 'text' && (
                  <p className="text-gray-700 leading-relaxed">{section.content}</p>
                )}
                
                {section.type === 'list' && (
                  <ul className="space-y-2">
                    {section.content.split('\n').map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                
                {section.type === 'code' && (
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <code className="text-green-400 text-sm font-mono whitespace-pre">
                      {section.content}
                    </code>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Resources */}
      {content.resources && content.resources.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resources</CardTitle>
          </CardHeader>
          <CardContent>
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
                    {resource.type === 'pdf' && <FileText className="w-5 h-5 text-red-500" />}
                    {resource.type === 'link' && <ExternalLink className="w-5 h-5 text-blue-500" />}
                    {resource.type === 'document' && <Download className="w-5 h-5 text-green-500" />}
                    <div>
                      <div className="font-medium text-sm text-gray-900 group-hover:text-primary">
                        {resource.title}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {resource.type}
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary" />
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Practice Exercise */}
      <Card className="mt-6 border-accent/20 bg-accent/5">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
              <span className="text-white text-xs">!</span>
            </div>
            <h3 className="font-semibold text-accent-foreground">Try It Out</h3>
          </div>
          <p className="text-sm text-accent-foreground/80 mb-3">
            Open your browser's developer console and try creating a simple React component using the patterns shown in this lesson.
          </p>
          <Badge variant="outline" className="text-accent border-accent">
            Optional Exercise
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}
