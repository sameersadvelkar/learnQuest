import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TabContent {
  id: string;
  label: string;
  content: string;
  image?: string;
  imageAlt?: string;
  component?: React.ReactNode;
}

interface InteractiveTabsProps {
  tabs: TabContent[];
  defaultTab?: string;
  className?: string;
  variant?: 'default' | 'pills' | 'underlined';
  orientation?: 'horizontal' | 'vertical';
  onTabChange?: (tabId: string) => void;
}

export function InteractiveTabs({
  tabs,
  defaultTab,
  className = '',
  variant = 'default',
  orientation = 'horizontal',
  onTabChange
}: InteractiveTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '');

  const getTabStyles = () => {
    switch (variant) {
      case 'pills':
        return {
          container: 'p-1 bg-gray-100 rounded-lg',
          tab: 'px-4 py-2 rounded-md transition-colors',
          activeTab: 'bg-white text-blue-600 shadow-sm',
          inactiveTab: 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        };
      case 'underlined':
        return {
          container: 'border-b border-gray-200',
          tab: 'px-4 py-2 border-b-2 transition-colors',
          activeTab: 'border-blue-600 text-blue-600',
          inactiveTab: 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
        };
      default:
        return {
          container: 'border-b border-gray-200 bg-gray-50',
          tab: 'px-4 py-2 transition-colors',
          activeTab: 'bg-white text-blue-600 border-t-2 border-blue-600',
          inactiveTab: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        };
    }
  };

  const styles = getTabStyles();
  const activeTabData = Array.isArray(tabs) ? tabs.find(tab => tab.id === activeTab) : null;

  if (!Array.isArray(tabs) || tabs.length === 0) {
    return (
      <Card className={`p-6 ${className}`}>
        <p className="text-gray-500">No tabs available</p>
      </Card>
    );
  }

  return (
    <div className={`${className} ${orientation === 'vertical' ? 'flex gap-4' : ''}`}>
      {/* Tab Navigation */}
      <div 
        className={`
          ${styles.container} 
          ${orientation === 'vertical' ? 'flex flex-col w-48 min-w-48' : 'flex'} 
          ${orientation === 'vertical' && variant === 'default' ? 'border-r border-b-0' : ''}
        `}
      >
        {Array.isArray(tabs) && tabs.map((tab) => (
          <Button
            key={tab.id}
            variant="ghost"
            onClick={() => {
              setActiveTab(tab.id);
              onTabChange?.(tab.id);
            }}
            className={`
              ${styles.tab}
              ${activeTab === tab.id ? styles.activeTab : styles.inactiveTab}
              ${orientation === 'vertical' ? 'justify-start' : ''}
            `}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      <Card className={`${orientation === 'vertical' ? 'flex-1' : 'mt-4'} min-h-64`}>
        {activeTabData && (
          <div className="p-6">
            {/* Custom Component */}
            {activeTabData.component ? (
              <div>{activeTabData.component}</div>
            ) : (
              <div>
                {/* Image */}
                {activeTabData.image && (
                  <div className="mb-4">
                    <img 
                      src={activeTabData.image} 
                      alt={activeTabData.imageAlt || 'Tab content image'}
                      className="w-full max-w-md h-48 object-cover rounded"
                    />
                  </div>
                )}
                
                {/* Text Content */}
                <div className="text-gray-700 leading-relaxed">
                  {activeTabData.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-3 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}