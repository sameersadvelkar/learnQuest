import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AudioNarration } from './AudioNarration';
import LanguageSelector from '@/components/LanguageSelector';
import { useTranslation } from '@/hooks/useTranslation';
import { BookOpen, Clock, User, Target, CheckCircle, PlayCircle } from 'lucide-react';
import { createTranslationService, SUPPORTED_LANGUAGES } from '@/services/translationService';
import type { Course, Module, CourseTranslation } from '@shared/schema';

interface CourseIntroductionProps {
  courseId: number;
  onStartCourse?: () => void;
  className?: string;
}

interface TranslatedContent {
  title: string;
  description: string;
  prerequisites: string[];
  learningObjectives: string[];
  instructorName: string;
}

export function CourseIntroduction({ courseId, onStartCourse, className = '' }: CourseIntroductionProps) {
  const { t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<TranslatedContent | null>(null);
  const [translationService] = useState(() => 
    createTranslationService({
      translationProvider: 'libretranslate',
      ttsProvider: 'webspeech'
    })
  );

  // Fetch course data
  const { data: course, isLoading } = useQuery<Course & { modules: Module[] }>({
    queryKey: ['/api/courses', courseId, 'preview'],
  });

  // Fetch existing translations
  const { data: existingTranslations } = useQuery<CourseTranslation[]>({
    queryKey: ['/api/courses', courseId, 'translations'],
  });

  const supportedLanguages = course?.supportedLanguages || ['en'];

  useEffect(() => {
    if (course && currentLanguage !== course.defaultLanguage) {
      handleLanguageChange(currentLanguage);
    }
  }, [course, currentLanguage]);

  const handleLanguageChange = async (language: string) => {
    if (!course || language === course.defaultLanguage) {
      setTranslatedContent(null);
      setCurrentLanguage(language);
      return;
    }

    setIsTranslating(true);

    try {
      // Check if translation already exists
      const existingTranslation = existingTranslations?.find(t => t.language === language);
      
      if (existingTranslation) {
        setTranslatedContent({
          title: existingTranslation.title || course.title,
          description: existingTranslation.description || course.description,
          prerequisites: existingTranslation.prerequisites || course.prerequisites || [],
          learningObjectives: existingTranslation.learningObjectives || course.learningObjectives || [],
          instructorName: existingTranslation.instructorName || course.instructorName || 'Instructor'
        });
      } else {
        // Translate content using the translation service
        const [translatedTitle, translatedDescription, translatedPrerequisites, translatedObjectives, translatedInstructor] = await Promise.all([
          translationService.translateText(course.title, language, course.defaultLanguage || 'en'),
          translationService.translateText(course.description, language, course.defaultLanguage || 'en'),
          Promise.all((course.prerequisites || []).map(p => 
            translationService.translateText(p, language, course.defaultLanguage || 'en')
          )),
          Promise.all((course.learningObjectives || []).map(o => 
            translationService.translateText(o, language, course.defaultLanguage || 'en')
          )),
          course.instructorName ? 
            translationService.translateText(course.instructorName, language, course.defaultLanguage || 'en') :
            Promise.resolve('Instructor')
        ]);

        const newTranslation: TranslatedContent = {
          title: translatedTitle,
          description: translatedDescription,
          prerequisites: translatedPrerequisites,
          learningObjectives: translatedObjectives,
          instructorName: translatedInstructor
        };

        setTranslatedContent(newTranslation);

        // Save translation to backend
        try {
          await fetch(`/api/courses/${courseId}/translations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              language,
              ...newTranslation,
              isAutoTranslated: true
            })
          });
        } catch (error) {
          console.error('Failed to save translation:', error);
        }
      }
    } catch (error) {
      console.error('Translation failed:', error);
      // Fall back to original content
      setTranslatedContent(null);
    } finally {
      setIsTranslating(false);
      setCurrentLanguage(language);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-muted rounded"></div>
        <div className="h-32 bg-muted rounded"></div>
        <div className="h-24 bg-muted rounded"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">Course not found</p>
      </Card>
    );
  }

  const displayContent = translatedContent || {
    title: course.title,
    description: course.description,
    prerequisites: course.prerequisites || [],
    learningObjectives: course.learningObjectives || [],
    instructorName: course.instructorName || 'Instructor'
  };

  const currentLanguageCode = SUPPORTED_LANGUAGES[currentLanguage as keyof typeof SUPPORTED_LANGUAGES]?.code || 'en-US';

  // Prepare content for audio narration
  const audioContent = `
    Course Title: ${displayContent.title}.
    Description: ${displayContent.description}.
    Instructor: ${displayContent.instructorName}.
    This course has ${course.totalModules} modules and takes approximately ${course.estimatedDuration} minutes to complete.
    ${displayContent.prerequisites.length > 0 ? `Prerequisites: ${displayContent.prerequisites.join(', ')}.` : ''}
    Learning Objectives: ${displayContent.learningObjectives.join('. ')}.
  `;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Language Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{displayContent.title}</h1>
          <p className="text-muted-foreground mt-1">{t('course.overview')}</p>
        </div>
        
        <LanguageSelector />
      </div>

      {/* Audio Narration */}
      <AudioNarration
        text={audioContent}
        language={currentLanguageCode}
        showControls={true}
      />

      {/* Course Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">{t('course.overview')}</h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            {displayContent.description}
          </p>

          {/* Course Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{t('course.instructor')}</p>
                <p className="text-sm text-muted-foreground">{displayContent.instructorName}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{t('course.duration')}</p>
                <p className="text-sm text-muted-foreground">{course.estimatedDuration} {t('common.minutes')}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{t('course.difficulty')}</p>
                <Badge variant="secondary">{course.difficulty}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prerequisites */}
      {displayContent.prerequisites.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">{t('course.prerequisites')}</h3>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {displayContent.prerequisites.map((prerequisite, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{prerequisite}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Learning Objectives */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">{t('course.learningObjectives')}</h3>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {displayContent.learningObjectives.map((objective, index) => (
              <li key={index} className="flex items-start gap-2">
                <Target className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">{objective}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Module Overview */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">{t('course.courseStructure')}</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{t('course.totalModules')}: {course.totalModules}</span>
              <span className="text-muted-foreground">{t('course.totalPages')}: {course.totalPages}</span>
            </div>
            
            {course.modules && course.modules.length > 0 && (
              <div className="space-y-2">
                <Separator />
                <h4 className="font-medium text-sm">{t('course.modulePreview')}:</h4>
                <div className="grid gap-2">
                  {course.modules.slice(0, 3).map((module, index) => (
                    <div key={module.id} className="flex items-center gap-2 p-2 rounded border">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{module.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {module.totalActivities} {t('course.activities')}
                        </p>
                      </div>
                    </div>
                  ))}
                  {course.modules.length > 3 && (
                    <p className="text-xs text-muted-foreground text-center py-2">
                      +{course.modules.length - 3} {t('course.moreModules')}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Start Course Button */}
      <div className="flex justify-center pt-4">
        <Button
          size="lg"
          onClick={onStartCourse}
          className="min-w-[200px]"
        >
          <PlayCircle className="h-5 w-5 mr-2" />
          {t('buttons.startCourse')}
        </Button>
      </div>
    </div>
  );
}