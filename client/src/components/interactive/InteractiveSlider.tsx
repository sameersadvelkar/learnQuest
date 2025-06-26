import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SlideItem {
  id: string;
  title?: string;
  content: string;
  image?: string;
  imageAlt?: string;
}

interface InteractiveSliderProps {
  slides: SlideItem[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  className?: string;
  slideHeight?: string;
  onSlideChange?: (slideId: string) => void;
}

export function InteractiveSlider({
  slides,
  autoPlay = false,
  autoPlayInterval = 5000,
  showDots = true,
  showArrows = true,
  className = '',
  slideHeight = 'h-64',
  onSlideChange
}: InteractiveSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Trigger initial slide change when component mounts
    if (slides.length > 0) {
      onSlideChange?.(slides[0].id);
    }
  }, [slides.length]); // Remove onSlideChange from dependency to prevent infinite loop

  useEffect(() => {
    if (autoPlay && slides.length > 1) {
      const interval = setInterval(() => {
        const newIndex = (currentSlide + 1) % slides.length;
        setCurrentSlide(newIndex);
        if (slides[newIndex]) {
          onSlideChange?.(slides[newIndex].id);
        }
      }, autoPlayInterval);

      return () => clearInterval(interval);
    }
  }, [autoPlay, autoPlayInterval, slides.length, currentSlide, onSlideChange]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    if (slides[index]) {
      onSlideChange?.(slides[index].id);
    }
  };

  const goToPrevious = () => {
    const newIndex = (currentSlide - 1 + slides.length) % slides.length;
    setCurrentSlide(newIndex);
    if (slides[newIndex]) {
      onSlideChange?.(slides[newIndex].id);
    }
  };

  const goToNext = () => {
    const newIndex = (currentSlide + 1) % slides.length;
    setCurrentSlide(newIndex);
    if (slides[newIndex]) {
      onSlideChange?.(slides[newIndex].id);
    }
  };

  if (slides.length === 0) {
    return (
      <Card className={`${slideHeight} flex items-center justify-center ${className}`}>
        <p className="text-gray-500">No slides available</p>
      </Card>
    );
  }

  const currentSlideData = slides[currentSlide];

  return (
    <div className={`relative ${className}`}>
      <Card className={`${slideHeight} overflow-hidden`}>
        <div className="relative h-full">
          {/* Slide Content */}
          <div className="h-full flex">
            <div 
              className="flex transition-transform duration-500 ease-in-out h-full"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.isArray(slides) && slides.map((slide, index) => (
                <div key={slide.id} className="w-full flex-shrink-0 h-full">
                  {slide.image ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                      <div className="p-6 flex flex-col justify-center">
                        {slide.title && (
                          <h3 className="text-xl font-bold mb-3 text-gray-900">
                            {slide.title}
                          </h3>
                        )}
                        <div className="text-gray-700 leading-relaxed">
                          {slide.content.split('\n').map((paragraph, pIndex) => (
                            <p key={pIndex} className="mb-2 last:mb-0">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </div>
                      <div className="h-full">
                        <img 
                          src={slide.image} 
                          alt={slide.imageAlt || 'Slide image'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 h-full flex flex-col justify-center text-center">
                      {slide.title && (
                        <h3 className="text-2xl font-bold mb-4 text-gray-900">
                          {slide.title}
                        </h3>
                      )}
                      <div className="text-gray-700 leading-relaxed max-w-2xl mx-auto">
                        {slide.content.split('\n').map((paragraph, pIndex) => (
                          <p key={pIndex} className="mb-3 last:mb-0">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          {showArrows && slides.length > 1 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white z-10"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white z-10"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </Card>

      {/* Dots Navigation */}
      {showDots && slides.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id || `slide-${index}`}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide
                  ? 'bg-blue-600'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Slide Counter */}
      {slides.length > 1 && (
        <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
          {currentSlide + 1} / {slides.length}
        </div>
      )}
    </div>
  );
}