import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';

const DEMO_DATA = {
  title: "Digital Safety Matching",
  instructions: "Drag each solution to match it with the correct digital problem.",
  items: [
    { id: "item-1", content: "Use privacy settings and report the behavior", correctZone: "zone-1" },
    { id: "item-2", content: "Cross-check with multiple credible sources", correctZone: "zone-2" },
    { id: "item-3", content: "Set specific times for social media use", correctZone: "zone-3" }
  ],
  zones: [
    { id: "zone-1", label: "Maya is being cyberbullied" },
    { id: "zone-2", label: "Maya saw shocking news online" },
    { id: "zone-3", label: "Maya feels addicted to social media" }
  ]
};

export function DragDropDemo() {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [droppedItems, setDroppedItems] = useState<Record<string, string[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    if (submitted) return;
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', itemId);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, zoneId: string) => {
    e.preventDefault();
    if (submitted) return;
    
    const itemId = e.dataTransfer.getData('text/plain');
    if (!itemId) return;

    // Remove item from any existing zone
    const newDroppedItems = { ...droppedItems };
    Object.keys(newDroppedItems).forEach(zone => {
      newDroppedItems[zone] = newDroppedItems[zone]?.filter(id => id !== itemId) || [];
    });

    // Add item to new zone
    if (!newDroppedItems[zoneId]) {
      newDroppedItems[zoneId] = [];
    }
    newDroppedItems[zoneId].push(itemId);

    setDroppedItems(newDroppedItems);
  };

  const isItemDropped = (itemId: string): boolean => {
    return Object.values(droppedItems).some(items => items?.includes(itemId));
  };

  const getItemCurrentZone = (itemId: string): string | null => {
    for (const [zoneId, itemIds] of Object.entries(droppedItems)) {
      if (itemIds?.includes(itemId)) {
        return zoneId;
      }
    }
    return null;
  };

  const checkAnswers = () => {
    setSubmitted(true);
    setShowFeedback(true);
  };

  const resetAssessment = () => {
    setDroppedItems({});
    setSubmitted(false);
    setShowFeedback(false);
    setDraggedItem(null);
  };

  const getItemFeedback = (itemId: string) => {
    if (!submitted) return null;
    
    const item = DEMO_DATA.items.find(i => i.id === itemId);
    if (!item) return null;
    
    const currentZone = getItemCurrentZone(itemId);
    const isCorrect = currentZone === item.correctZone;
    
    return {
      isCorrect,
      icon: isCorrect ? 
        <CheckCircle className="h-4 w-4 text-green-600" /> : 
        <XCircle className="h-4 w-4 text-red-600" />
    };
  };

  const hasDroppedItems = Object.values(droppedItems).some(items => items && items.length > 0);
  const correctCount = submitted ? DEMO_DATA.items.filter(item => getItemCurrentZone(item.id) === item.correctZone).length : 0;

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{DEMO_DATA.title}</h3>
          <p className="text-gray-600">{DEMO_DATA.instructions}</p>
        </div>

        {/* Draggable Items */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Items to Sort:</h4>
          <div className="flex flex-wrap gap-3">
            {DEMO_DATA.items.map(item => {
              if (isItemDropped(item.id)) return null;
              
              const feedback = getItemFeedback(item.id);
              
              return (
                <div
                  key={item.id}
                  draggable={!submitted}
                  onDragStart={(e) => handleDragStart(e, item.id)}
                  onDragEnd={handleDragEnd}
                  className={`
                    px-4 py-2 bg-blue-100 border-2 border-blue-200 rounded-lg
                    transition-all duration-200 hover:bg-blue-200 hover:shadow-md
                    ${draggedItem === item.id ? 'opacity-50' : ''}
                    ${submitted ? 'cursor-default' : 'cursor-move'}
                    flex items-center gap-2
                  `}
                >
                  <span className="text-sm font-medium text-blue-800">{item.content}</span>
                  {feedback?.icon}
                </div>
              );
            })}
          </div>
        </div>

        {/* Drop Zones */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Drop Zones:</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {DEMO_DATA.zones.map(zone => {
              const zoneItems = droppedItems[zone.id] || [];
              
              return (
                <div
                  key={zone.id}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, zone.id)}
                  className={`
                    min-h-32 p-4 bg-white border-2 border-dashed rounded-lg shadow-sm
                    transition-all duration-200 hover:shadow-md
                    ${draggedItem ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}
                  `}
                >
                  <h5 className="font-medium text-gray-700 mb-2">{zone.label}</h5>
                  <div className="space-y-2">
                    {zoneItems.map(itemId => {
                      const item = DEMO_DATA.items.find(i => i.id === itemId);
                      const feedback = getItemFeedback(itemId);
                      
                      if (!item) return null;
                      
                      return (
                        <div
                          key={itemId}
                          className={`
                            px-3 py-2 bg-gray-50 border rounded shadow-sm flex items-center justify-between
                            ${feedback?.isCorrect === false ? 'border-red-200 bg-red-50' : ''}
                            ${feedback?.isCorrect === true ? 'border-green-200 bg-green-50' : ''}
                          `}
                        >
                          <span className="text-sm">{item.content}</span>
                          {feedback?.icon}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
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
            disabled={submitted || !hasDroppedItems}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {submitted ? 'Submitted' : 'Check Answers'}
          </Button>
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-center">
              <h4 className="font-semibold text-blue-900 mb-2">Results</h4>
              <p className="text-blue-800">
                You got {correctCount} out of {DEMO_DATA.items.length} correct!
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}