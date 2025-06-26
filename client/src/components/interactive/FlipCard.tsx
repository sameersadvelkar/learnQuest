import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { RotateCcw } from 'lucide-react';

interface FlipCardProps {
  frontImage?: string;
  frontImageAlt?: string;
  frontText?: string;
  backText: string;
  backImage?: string;
  backImageAlt?: string;
  className?: string;
  triggerMode?: 'hover' | 'click';
  width?: string;
  height?: string;
  variant?: 'default' | 'gradient' | 'neon' | 'minimal';
  onFlip?: (isFlipped: boolean) => void;
}

export function FlipCard({
  frontImage,
  frontImageAlt = 'Front image',
  frontText,
  backText,
  backImage,
  backImageAlt = 'Back image',
  className = '',
  triggerMode = 'click',
  width = 'w-64',
  height = 'h-48',
  variant = 'default',
  onFlip
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleInteraction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (triggerMode === 'click') {
      const newFlippedState = !isFlipped;
      setIsFlipped(newFlippedState);
      onFlip?.(newFlippedState);
    }
  };

  const handleMouseEnter = () => {
    if (triggerMode === 'hover') {
      setIsFlipped(true);
      onFlip?.(true);
    }
  };

  const handleMouseLeave = () => {
    if (triggerMode === 'hover') {
      setIsFlipped(false);
      onFlip?.(false);
    }
  };

  // Variant-specific styling
  const getVariantStyles = () => {
    switch (variant) {
      case 'gradient':
        return {
          front: 'bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 border-purple-200',
          back: 'bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 border-purple-600',
          hint: 'from-purple-500 to-pink-500'
        };
      case 'neon':
        return {
          front: 'bg-gray-900 border-cyan-400 shadow-cyan-400/50',
          back: 'bg-gray-900 border-green-400 shadow-green-400/50',
          hint: 'from-cyan-400 to-green-400'
        };
      case 'minimal':
        return {
          front: 'bg-white border-gray-300',
          back: 'bg-gray-200 border-gray-400',
          hint: 'from-gray-500 to-gray-600'
        };
      default:
        return {
          front: 'bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 border-blue-200',
          back: 'bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 border-blue-600',
          hint: 'from-blue-500 to-indigo-500'
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <div 
      className={`group relative ${width} ${height} perspective-1000 ${className}`}
      onClick={handleInteraction}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >

      {/* Flip Indicator */}
      {isFlipped && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 z-10 p-1 bg-emerald-500 rounded-full text-white shadow-lg animate-bounce">
          <RotateCcw className="w-3 h-3" />
        </div>
      )}

      <div 
        className={`relative w-full h-full transition-all duration-300 transform-style-preserve-3d cursor-pointer group-hover:scale-105 ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        style={{
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Front Side */}
        <Card className={`absolute inset-0 w-full h-full backface-hidden ${variantStyles.front} border-2 shadow-xl transition-all duration-300 ${
          isFlipped 
            ? 'border-gray-200 shadow-lg' 
            : 'shadow-2xl group-hover:shadow-2xl'
        } ${variant === 'neon' ? 'shadow-neon' : ''}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/50 to-blue-100/30 rounded-lg"></div>
          <div className="relative flex flex-col items-center justify-center h-full p-6">
            {frontImage ? (
              <div className="w-full h-3/4 mb-4 overflow-hidden rounded-xl shadow-md group-hover:shadow-lg transition-shadow duration-300">
                <img 
                  src={frontImage} 
                  alt={frontImageAlt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            ) : null}
            {frontText && (
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-800 leading-relaxed">{frontText}</p>
              </div>
            )}
            {!frontImage && !frontText && (
              <div className="text-center text-gray-600">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                  <RotateCcw className="w-8 h-8 text-white" />
                </div>
                <p className="text-lg font-semibold">Card Content</p>
              </div>
            )}
            
            {/* Front Card Decoration */}
            <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full opacity-60"></div>
            <div className="absolute bottom-4 left-4 w-1 h-1 bg-indigo-400 rounded-full opacity-60"></div>
          </div>
        </Card>

        {/* Back Side */}
        <Card className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 ${variantStyles.back} border-2 shadow-xl transition-all duration-300 ${
          isFlipped 
            ? 'shadow-2xl' 
            : 'shadow-lg'
        } ${variant === 'neon' ? 'shadow-neon' : ''}`}>
          <div className="relative flex flex-col items-center justify-center h-full p-6">
            {backImage ? (
              <div className="w-full h-3/4 mb-4 overflow-hidden rounded-xl shadow-md">
                <img 
                  src={backImage} 
                  alt={backImageAlt}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : null}
            <div className="text-center">
              <p className="text-lg font-semibold text-white leading-relaxed drop-shadow-sm">{backText}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}