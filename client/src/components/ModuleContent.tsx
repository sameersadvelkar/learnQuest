import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { VideoPlayer } from '@/components/VideoPlayer';
import { ImageDisplay } from '@/components/ImageDisplay';
import { QuizComponent } from '@/components/QuizComponent';
import { AssetRenderer, AssetGallery } from '@/components/AssetRenderer';
import { FlipCard } from '@/components/interactive/FlipCard';
import { MultipleChoiceAssessment } from '@/components/interactive/MultipleChoiceAssessment';
import { InteractiveSlider } from '@/components/interactive/InteractiveSlider';
import { InteractiveAccordion } from '@/components/interactive/InteractiveAccordion';
import { InteractiveTabs } from '@/components/interactive/InteractiveTabs';
import { DragDropAssessment } from '@/components/interactive/DragDropAssessment';
import { useCourse } from '@/contexts/CourseContext';
import { useProgressTracking } from '@/hooks/useProgress';
import { Video, BookOpen, CheckCircle, PlayCircle, Award, Image } from 'lucide-react';

export function ModuleContent() {
  const { state: courseState } = useCourse();
  const { currentModule, currentActivity } = courseState;
  const { completeActivity, isActivityCompleted, isModuleCompleted, getModuleProgress } = useProgressTracking();

  if (!currentModule || !currentActivity) {
    return null;
  }

  const isCompleted = isActivityCompleted(currentActivity.id);
  const moduleProgress = getModuleProgress(currentModule.id);
  const moduleIsCompleted = isModuleCompleted(currentModule.id);

  const handleCompleteActivity = () => {
    completeActivity(currentActivity.id, currentModule.id);
  };

  const renderActivityContent = () => {
    let content;
    try {
      // Parse content if it's a JSON string
      content = typeof currentActivity.content === 'string' 
        ? JSON.parse(currentActivity.content) 
        : currentActivity.content;
    } catch (error) {
      console.error('Error parsing activity content:', error);
      content = currentActivity.content;
    }
    
    // Handle different activity types based on real course content
    switch (currentActivity.type) {
      case 'interactive':
      case 'assessment':
        return (
          <div className="space-y-6">
            {/* Interactive Components */}
            {content?.components?.map((component: any, index: number) => (
              <div key={index}>
                {component.type === 'flipcard' && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">{component.title}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {component.data.cards?.map((card: any, cardIndex: number) => (
                        <FlipCard
                          key={cardIndex}
                          frontText={card.front}
                          backText={card.back}
                          triggerMode="click"
                          width="w-full"
                          height="h-56"
                          variant={cardIndex % 2 === 0 ? "default" : "gradient"}
                          onFlip={(isFlipped) => console.log(`Card ${cardIndex + 1} flipped:`, isFlipped)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {component.type === 'dragdrop' && (
                  <DragDropAssessment
                    title={component.title}
                    instructions={component.data.instruction || component.data.instructions || "Match the items to their correct categories"}
                    items={component.data.items?.map((item: string, itemIndex: number) => {
                      // Find which category this item belongs to
                      const category = component.data.categories?.find((cat: any) => 
                        cat.items && Array.isArray(cat.items) && cat.items.includes(item)
                      );
                      return {
                        id: `item-${itemIndex}`,
                        content: item,
                        correctZone: category ? `zone-${component.data.categories.indexOf(category)}` : `zone-0`
                      };
                    }) || []}
                    zones={component.data.categories?.map((category: any, catIndex: number) => ({
                      id: `zone-${catIndex}`,
                      label: category.name || category.title || category.label || `Zone ${catIndex + 1}`,
                      acceptsItems: Array.isArray(category.items) ? category.items : []
                    })) || []}
                    onComplete={(score: number, totalItems: number) => {
                      console.log('Drag drop completed:', score, totalItems);
                      if (score === totalItems) {
                        handleCompleteActivity();
                      }
                    }}
                    instanceId={`activity_${currentActivity.id}_component_${index}`}
                  />
                )}
                
                {component.type === 'multiplechoice' && (
                  <MultipleChoiceAssessment
                    title={component.title}
                    questions={[
                      {
                        id: `q_${index}`,
                        question: component.data.question,
                        type: 'single',
                        options: component.data.options?.map((option: string, optIndex: number) => ({
                          id: `opt_${optIndex}`,
                          text: option,
                          isCorrect: optIndex === component.data.correctAnswer
                        })) || [],
                        explanation: component.data.explanation
                      }
                    ]}
                    onComplete={(score, total) => {
                      console.log(`Quiz completed: ${score}/${total}`);
                      if (score === total) {
                        handleCompleteActivity();
                      }
                    }}
                    showExplanations={true}
                    instanceId={`activity_${currentActivity.id}_component_${index}`}
                  />
                )}

                {component.type === 'slider' && (
                  <Card className="border border-gray-200 shadow-sm">
                    <CardContent className="p-6">
                      <InteractiveSlider
                        slides={component.data.slides?.map((slide: any, slideIndex: number) => ({
                          id: `slide_${slideIndex}`,
                          title: slide.title,
                          content: slide.content || slide.headline || '',
                          image: slide.image,
                          imageAlt: slide.imageAlt
                        })) || []}
                        autoPlay={component.data.autoPlay || false}
                        showDots={component.data.showDots !== false}
                        showArrows={component.data.showArrows !== false}
                        onSlideChange={(slideId) => console.log('Slide changed:', slideId)}
                      />
                    </CardContent>
                  </Card>
                )}

                {component.type === 'accordion' && (
                  <Card className="bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl shadow-blue-100/20 hover:shadow-2xl hover:shadow-blue-200/30 transition-all duration-300 rounded-2xl">
                    <CardContent className="p-8">
                      <InteractiveAccordion
                        items={component.data.sections?.map((section: any, sectionIndex: number) => ({
                          id: `section_${sectionIndex}`,
                          title: section.title,
                          content: section.content,
                          image: section.image,
                          imageAlt: section.imageAlt
                        })) || component.data.items || []}
                        allowMultiple={component.data.allowMultiple || false}
                        variant={component.data.variant || 'default'}
                        onItemClick={(itemId) => console.log('Accordion item clicked:', itemId)}
                      />
                    </CardContent>
                  </Card>
                )}

                {component.type === 'tabs' && (
                  <InteractiveTabs
                    tabs={component.data.tabs?.map((tab: any, tabIndex: number) => ({
                      id: `tab_${tabIndex}`,
                      label: tab.title,
                      content: tab.content,
                      image: tab.image,
                      imageAlt: tab.imageAlt
                    })) || []}
                    defaultTab={`tab_0`}
                    variant={component.data.variant || 'default'}
                    onTabChange={(tabId) => console.log('Tab changed:', tabId)}
                  />
                )}
              </div>
            ))}
          </div>
        );
        
      case 'video':
        if (currentActivity.videoUrl) {
          return (
            <Card className="bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl shadow-blue-100/20 hover:shadow-2xl hover:shadow-blue-200/30 transition-all duration-300 rounded-2xl">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center bg-gradient-to-r from-emerald-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center mr-3">
                    <Video className="w-4 h-4 text-white" />
                  </div>
                  Video Content
                </h3>
                <VideoPlayer
                  url={currentActivity.videoUrl}
                  title={currentActivity.title}
                  onComplete={handleCompleteActivity}
                />
              </CardContent>
            </Card>
          );
        }
        break;
        
      case 'quiz':
        if (content && content.type === 'quiz') {
          return (
            <Card className="bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl shadow-blue-100/20 hover:shadow-2xl hover:shadow-blue-200/30 transition-all duration-300 rounded-2xl">
              <CardContent className="p-8">
                <QuizComponent
                  content={content}
                  onComplete={(score) => {
                    console.log('Quiz completed with score:', score);
                    handleCompleteActivity();
                  }}
                />
              </CardContent>
            </Card>
          );
        }
        break;
        
      case 'reading':
        return (
          <Card className="bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl shadow-blue-100/20 hover:shadow-2xl hover:shadow-blue-200/30 transition-all duration-300 rounded-2xl">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center bg-gradient-to-r from-emerald-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center mr-3">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                Reading Material
              </h3>
              {renderReadingContent(content)}
            </CardContent>
          </Card>
        );
        
      // Asset rendering cases
      case 'image':
      case 'audio':
      case 'pdf':
      case 'document':
        // Handle asset-based activities
        return null;
        
      default:
        // Return null if no authentic content is available
        return null;
    }
    
    return null;
  };

  const renderReadingContent = (content: any) => {
    if (content && content.type === 'tabbed_content' && content.tabs) {
      return (
        <div className="space-y-4">
          {content.tabs.map((tab: any, index: number) => (
            <div key={tab.id || index} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">{tab.title}</h4>
              {tab.content?.type === 'markdown' && (
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap text-sm">{tab.content.text}</pre>
                </div>
              )}
              {tab.content?.type === 'code_example' && (
                <div className="bg-gray-900 text-green-400 p-4 rounded-md font-mono text-sm overflow-x-auto">
                  <pre>{tab.content.code}</pre>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }
    
    return (
      <div className="text-gray-600">
        <p>Reading content will be displayed here.</p>
      </div>
    );
  };

  return (
    <div className="space-y-8 p-6">
      {/* Activity Status and Completion */}
      <div className="bg-white/60 backdrop-blur-xl border border-white/30 shadow-lg shadow-blue-100/20 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {(() => {
              const getActivityBadge = () => {
                switch (currentActivity.type) {
                  case 'video':
                    return (
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200">
                        <Video className="w-4 h-4 mr-1" />
                        Video
                      </Badge>
                    );
                  case 'quiz':
                  case 'assessment':
                    return (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Assessment
                      </Badge>
                    );
                  case 'interactive':
                    return (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                        <PlayCircle className="w-4 h-4 mr-1" />
                        Interactive
                      </Badge>
                    );
                  case 'reading':
                    return (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                        <BookOpen className="w-4 h-4 mr-1" />
                        Reading
                      </Badge>
                    );
                  case 'image':
                    return (
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
                        <Image className="w-4 h-4 mr-1" />
                        Image
                      </Badge>
                    );
                  default:
                    return (
                      <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-200">
                        <PlayCircle className="w-4 h-4 mr-1" />
                        {currentActivity.type.charAt(0).toUpperCase() + currentActivity.type.slice(1)}
                      </Badge>
                    );
                }
              };
              return getActivityBadge();
            })()}
            <span className="text-sm text-gray-500">
              Duration: {currentActivity.duration || 15} minutes
            </span>
          </div>
        
        <div className="flex items-center space-x-3">
          {isCompleted ? (
            <Badge className="bg-green-600 text-white">
              <CheckCircle className="w-4 h-4 mr-1" />
              Completed
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
              <CheckCircle className="w-4 h-4 mr-1" />
              Assessment Incomplete
            </Badge>
          )}
        </div>
        </div>
      </div>

      {/* Interactive Content */}
      <div className="space-y-6">
        {renderActivityContent()}
      </div>
    </div>
  );
}