import { useState } from 'react';
import { 
  FlipCard, 
  InteractiveAccordion, 
  InteractiveSlider, 
  InteractiveTabs, 
  DragDropAssessment, 
  MultipleChoiceAssessment 
} from './interactive';

interface InteractiveComponentData {
  type: 'tabs' | 'flipcard' | 'flipcards' | 'accordion' | 'slider' | 'dragdrop' | 'multiplechoice';
  title: string;
  data: any;
}

interface InteractiveActivityProps {
  components: InteractiveComponentData[];
  story?: string;
  onComponentComplete?: (componentType: string, score?: number, total?: number) => void;
  onActivityComplete?: () => void;
  activityId?: number | string;
}

export function InteractiveActivityRenderer({ 
  components, 
  story,
  onComponentComplete, 
  onActivityComplete, 
  activityId = 'default' 
}: InteractiveActivityProps) {
  
  // Clean up any existing interactive component localStorage data
  if (typeof window !== 'undefined') {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('interactive-elements-')) {
        localStorage.removeItem(key);
      }
    });
  }

  // Handle component interaction events (audio system disabled)
  const handleComponentInteraction = (componentType: string) => {
    // Audio system removed per user request
  };

  const renderComponent = (component: InteractiveComponentData, index: number) => {
    const { type, title, data } = component;
    
    switch (type) {
      case 'tabs':
        const tabsData = (data.tabs || []).map((tab: any, idx: number) => ({
          id: tab.id || `tab-${idx}`,
          label: tab.label || tab.title || `Tab ${idx + 1}`,
          content: tab.content || '',
          image: tab.image,
          imageAlt: tab.imageAlt
        }));
        
        return (
          <div key={index} className="mb-8">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
            <InteractiveTabs
              tabs={tabsData}
              variant="default"
              orientation="horizontal"
              onTabChange={() => handleComponentInteraction('tabs')}
            />
          </div>
        );

      case 'flipcard':
      case 'flipcards':
        const cardsData = Array.isArray(data.cards) ? data.cards : [];
        
        return (
          <div key={index} className="mb-8">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cardsData.map((card: any, cardIndex: number) => (
                <FlipCard
                  key={cardIndex}
                  frontText={card.front || card.frontText}
                  backText={card.back || card.backText}
                  frontImage={card.frontImage}
                  backImage={card.backImage}
                  width="w-full"
                  height="h-56"
                  variant={cardIndex % 3 === 0 ? "default" : cardIndex % 3 === 1 ? "gradient" : "minimal"}
                  triggerMode="click"
                  onFlip={(isFlipped) => handleComponentInteraction('flipcard')}
                />
              ))}
            </div>
          </div>
        );

      case 'accordion':
        const accordionItems = (data.sections || data.items || []).map((item: any, idx: number) => ({
          id: item.id || `section-${idx}`,
          title: item.title,
          content: item.content,
          image: item.image,
          imageAlt: item.imageAlt
        }));
        
        return (
          <div key={index} className="mb-8">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
            <InteractiveAccordion
              items={accordionItems}
              allowMultiple={data.allowMultiple || false}
              variant={data.variant || 'default'}
              onItemClick={() => handleComponentInteraction('accordion')}
            />
          </div>
        );

      case 'slider':
        const slidesData = (data.slides || []).map((slide: any, idx: number) => ({
          id: slide.id || `slide-${idx}`,
          title: slide.title,
          content: slide.content || slide.headline || '',
          image: slide.image,
          imageAlt: slide.imageAlt
        }));
        
        return (
          <div key={index} className="mb-8">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
            <InteractiveSlider
              slides={slidesData}
              autoPlay={data.autoPlay || false}
              autoPlayInterval={data.autoPlayInterval || 5000}
              showDots={data.showDots !== false}
              showArrows={data.showArrows !== false}
              slideHeight={data.slideHeight || 'h-64'}
              onSlideChange={() => handleComponentInteraction('slider')}
            />
          </div>
        );

      case 'dragdrop':
        // Transform the data structure to match what DragDropAssessment expects
        const allItems = data.items || [];
        const allCategories = data.categories || [];
        
        // Ensure we have valid arrays
        if (!Array.isArray(allItems) || !Array.isArray(allCategories)) {
          return null;
        }
        
        const dragItems = allItems.map((item: string, idx: number) => {
          // Find which category this item belongs to
          const category = allCategories.find((cat: any) => 
            cat.items && Array.isArray(cat.items) && cat.items.includes(item)
          );
          return {
            id: `item-${idx}`,
            content: item,
            correctZone: category ? `zone-${allCategories.indexOf(category)}` : `zone-0`
          };
        });

        const dropZones = allCategories.map((cat: any, idx: number) => ({
          id: `zone-${idx}`,
          label: cat.name || cat.title || cat.label || `Zone ${idx + 1}`,
          acceptsItems: Array.isArray(cat.items) ? cat.items : []
        }));
        
        return (
          <div key={index} className="mb-8">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
            <DragDropAssessment
              title=""
              instructions={data.instruction || data.instructions || ''}
              items={dragItems}
              zones={dropZones}
              instanceId={`dd-${activityId}-${index}-${title.replace(/\s+/g, '-').toLowerCase()}`}
              onComplete={(score, total) => {
                handleComponentInteraction('dragdrop');
                onComponentComplete?.('dragdrop', score, total);
              }}
            />
          </div>
        );

      case 'multiplechoice':
        // Transform single question format to questions array format
        const questions = [{
          id: `question-${index}`,
          question: data.question || '',
          type: 'single' as const,
          options: (data.options || []).map((option: string, optIdx: number) => ({
            id: `option-${optIdx}`,
            text: option,
            isCorrect: optIdx === (data.correctAnswer || 0)
          })),
          explanation: data.explanation || ''
        }];

        return (
          <div key={index} className="mb-8">
            <MultipleChoiceAssessment
              title={title}
              questions={questions}
              instanceId={`mc-${activityId}-${index}-${title.replace(/\s+/g, '-').toLowerCase()}`}
              onComplete={(score, total) => {
                handleComponentInteraction('multiplechoice');
                onComponentComplete?.('multiplechoice', score, total);
              }}
            />
          </div>
        );

      default:
        return (
          <div key={index} className="mb-8 p-4 border border-red-200 bg-red-50 rounded-lg">
            <p className="text-red-700">Unknown component type: {type}</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Render interactive components - story context now handled in course page */}
      {components.map((component, index) => renderComponent(component, index))}
      
      {/* Learning Audio Manager - disabled */}
      {/* Audio player removed per user request */}
    </div>
  );
}