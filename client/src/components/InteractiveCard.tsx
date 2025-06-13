import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LucideIcon, ChevronRight, Star } from 'lucide-react';

interface InteractiveCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  badges?: string[];
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glassmorphism' | 'gradient';
  expandable?: boolean;
  rating?: number;
  progress?: number;
  style?: React.CSSProperties;
}

export function InteractiveCard({
  title,
  description,
  icon: Icon,
  badges = [],
  onClick,
  children,
  className = '',
  variant = 'default',
  expandable = false,
  rating,
  progress,
  style
}: InteractiveCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getVariantClasses = () => {
    switch (variant) {
      case 'glassmorphism':
        return 'glassmorphism border-0';
      case 'gradient':
        return 'gradient-border';
      default:
        return '';
    }
  };

  const cardContent = (
    <div className={variant === 'gradient' ? 'gradient-border-content p-6' : ''}>
      <CardHeader className={variant === 'gradient' ? 'p-0 pb-4' : ''}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {Icon && (
              <div className={`p-2 rounded-lg transition-all duration-300 ${
                isHovered ? 'bg-primary text-white scale-110' : 'bg-primary/10 text-primary'
              }`}>
                <Icon className="h-5 w-5" />
              </div>
            )}
            <div>
              <CardTitle className="text-lg font-semibold">{title}</CardTitle>
              {description && (
                <CardDescription className="mt-1">{description}</CardDescription>
              )}
            </div>
          </div>
          {expandable && (
            <ChevronRight 
              className={`h-5 w-5 transition-transform duration-300 ${
                isExpanded ? 'rotate-90' : ''
              }`} 
            />
          )}
        </div>
        
        {rating && (
          <div className="flex items-center space-x-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
            <span className="text-sm text-muted-foreground ml-1">({rating}/5)</span>
          </div>
        )}

        {badges.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {badges.map((badge, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs transition-all duration-200 hover:scale-105"
              >
                {badge}
              </Badge>
            ))}
          </div>
        )}

        {progress !== undefined && (
          <div className="mt-3">
            <div className="flex justify-between text-sm text-muted-foreground mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 bg-gray-700 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </CardHeader>

      {(children || (expandable && isExpanded)) && (
        <CardContent className={`${variant === 'gradient' ? 'p-0' : ''} ${
          expandable ? 'transition-all duration-300' : ''
        } ${isExpanded || !expandable ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
          {children}
        </CardContent>
      )}
    </div>
  );

  return (
    <Card 
      className={`
        card-hover scale-in transition-all duration-300 cursor-pointer
        ${getVariantClasses()}
        ${className}
      `}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        if (expandable) {
          setIsExpanded(!isExpanded);
        }
        onClick?.();
      }}
    >
      {variant === 'gradient' ? cardContent : (
        <>
          {cardContent}
        </>
      )}
    </Card>
  );
}

interface StatsGridProps {
  stats: Array<{
    title: string;
    value: number;
    icon: LucideIcon;
    color: string;
    trend?: number;
    prefix?: string;
    suffix?: string;
  }>;
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <InteractiveCard
          key={index}
          title={stat.title}
          icon={stat.icon}
          variant="glassmorphism"
          className="slide-in-left"
          style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {stat.prefix}{stat.value.toLocaleString()}{stat.suffix}
            </div>
            {stat.trend !== undefined && (
              <div className={`text-sm ${
                stat.trend > 0 ? 'text-green-600' : stat.trend < 0 ? 'text-red-600' : 'text-gray-600'
              }`}>
                {stat.trend > 0 ? '↗' : stat.trend < 0 ? '↘' : '→'} {Math.abs(stat.trend)}%
              </div>
            )}
          </div>
        </InteractiveCard>
      ))}
    </div>
  );
}