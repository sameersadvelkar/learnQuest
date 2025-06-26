import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface AccordionItem {
  id: string;
  title: string;
  content: string;
  image?: string;
  imageAlt?: string;
}

interface InteractiveAccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  className?: string;
  variant?: 'default' | 'minimal' | 'bordered';
  onItemClick?: (itemId: string) => void;
}

export function InteractiveAccordion({
  items,
  allowMultiple = false,
  className = '',
  variant = 'default',
  onItemClick
}: InteractiveAccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (itemId: string) => {
    const newOpenItems = new Set(openItems);
    
    if (allowMultiple) {
      if (newOpenItems.has(itemId)) {
        newOpenItems.delete(itemId);
      } else {
        newOpenItems.add(itemId);
      }
    } else {
      if (newOpenItems.has(itemId)) {
        newOpenItems.clear();
      } else {
        newOpenItems.clear();
        newOpenItems.add(itemId);
      }
    }
    
    setOpenItems(newOpenItems);
    onItemClick?.(itemId);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'minimal':
        return {
          container: 'space-y-2',
          item: 'bg-transparent border-b border-gray-200',
          header: 'py-3 px-0 hover:bg-gray-50',
          content: 'pb-3 px-0'
        };
      case 'bordered':
        return {
          container: 'space-y-3',
          item: 'bg-white border-2 border-gray-200 rounded-lg shadow-sm',
          header: 'py-4 px-6 hover:bg-gray-50',
          content: 'pb-4 px-6'
        };
      default:
        return {
          container: 'space-y-2',
          item: 'bg-white border border-gray-200 rounded-md shadow-sm',
          header: 'py-3 px-4 hover:bg-gray-50',
          content: 'pb-3 px-4'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={`${styles.container} ${className}`}>
      {Array.isArray(items) && items.map((item) => {
        const isOpen = openItems.has(item.id);
        
        return (
          <Card key={item.id} className={styles.item}>
            <button
              onClick={() => toggleItem(item.id)}
              className={`w-full text-left flex items-center justify-between transition-colors ${styles.header}`}
            >
              <span className="font-medium text-gray-900">{item.title}</span>
              {isOpen ? (
                <ChevronDown className="h-5 w-5 text-gray-500 transition-transform" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-500 transition-transform" />
              )}
            </button>
            
            {isOpen && (
              <div className={`transition-all duration-300 ease-in-out ${styles.content}`}>
                {item.image && (
                  <div className="mb-3">
                    <img 
                      src={item.image} 
                      alt={item.imageAlt || 'Accordion content image'}
                      className="w-full max-w-md h-40 object-cover rounded"
                    />
                  </div>
                )}
                <div className="text-gray-700 leading-relaxed">
                  {item.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-2 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}