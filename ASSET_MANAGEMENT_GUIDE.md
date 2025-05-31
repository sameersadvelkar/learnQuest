# Asset Management Guide

This guide shows developers how to add and use images, audio, video, and documents in the educational LMS platform.

## Asset Folder Structure

```
client/src/assets/
├── images/          # Images (png, jpg, svg, webp, gif)
├── audio/           # Audio files (mp3, wav, ogg)
├── video/           # Video files (mp4, webm, mov)
└── documents/       # Documents (pdf, txt, md)
```

## Adding Assets

1. **Add your files** to the appropriate folder in `client/src/assets/`
2. **Use descriptive names**: `react-components-diagram.png` instead of `image1.png`
3. **Supported formats**:
   - Images: PNG, JPG, SVG, WebP, GIF
   - Audio: MP3, WAV, OGG
   - Video: MP4, WebM, MOV
   - Documents: PDF, TXT, MD

## Using Assets in Content JSON

### Image Activity Example
```json
{
  "id": 16,
  "moduleId": 1,
  "title": "Understanding React Components",
  "description": "Visual guide to React components",
  "type": "image",
  "orderIndex": 4,
  "duration": 5,
  "isLocked": false,
  "content": {
    "type": "image",
    "src": "@/assets/images/react-components-diagram.png",
    "alt": "React Components Diagram",
    "title": "React Components Architecture",
    "caption": "This diagram shows how React components work together",
    "width": "100%"
  }
}
```

### Audio Activity Example
```json
{
  "id": 17,
  "moduleId": 1,
  "title": "Introduction Audio",
  "description": "Listen to the course introduction",
  "type": "audio",
  "orderIndex": 5,
  "duration": 10,
  "isLocked": false,
  "content": {
    "type": "audio",
    "src": "@/assets/audio/course-intro.mp3",
    "title": "Course Introduction",
    "description": "Welcome to the React course",
    "controls": true,
    "autoplay": false
  }
}
```

### Document Activity Example
```json
{
  "id": 18,
  "moduleId": 1,
  "title": "Course Handbook",
  "description": "Download the complete course handbook",
  "type": "document",
  "orderIndex": 6,
  "duration": 15,
  "isLocked": false,
  "content": {
    "type": "document",
    "src": "@/assets/documents/react-handbook.pdf",
    "title": "React Development Handbook",
    "description": "Complete guide to React development best practices",
    "downloadable": true
  }
}
```

### Reading with Multiple Images
```json
{
  "content": {
    "type": "tabbed_content",
    "tabs": [
      {
        "id": "overview",
        "title": "Overview",
        "content": {
          "type": "markdown",
          "text": "# Component Lifecycle\n\nReact components have a lifecycle..."
        }
      },
      {
        "id": "diagram",
        "title": "Visual Guide",
        "content": {
          "type": "image",
          "src": "@/assets/images/lifecycle-diagram.svg",
          "alt": "Component Lifecycle Diagram",
          "caption": "Visual representation of React component lifecycle"
        }
      }
    ]
  }
}
```

### Asset Gallery Example
```json
{
  "content": {
    "type": "asset_gallery",
    "assets": [
      {
        "type": "image",
        "src": "@/assets/images/example1.png",
        "alt": "Example 1",
        "title": "Basic Component"
      },
      {
        "type": "image",
        "src": "@/assets/images/example2.png",
        "alt": "Example 2", 
        "title": "Component with Props"
      },
      {
        "type": "image",
        "src": "@/assets/images/example3.png",
        "alt": "Example 3",
        "title": "Component with State"
      }
    ],
    "columns": 3
  }
}
```

## Using Assets in React Components

### Import Assets Directly
```jsx
import logoImage from '@/assets/images/logo.png';
import { ImageDisplay } from '@/components/ImageDisplay';

function Header() {
  return (
    <div>
      <img src={logoImage} alt="Logo" />
      {/* OR use the ImageDisplay component */}
      <ImageDisplay 
        src={logoImage} 
        alt="Logo"
        maxWidth="200px"
      />
    </div>
  );
}
```

### Use Asset Utilities
```jsx
import { createAssetUrl, AssetCollections } from '@/lib/assets';

function MyComponent() {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const loadImage = async () => {
      const url = await createAssetUrl('image', 'my-image.png');
      setImageUrl(url);
    };
    loadImage();
  }, []);

  return <img src={imageUrl} alt="Dynamic image" />;
}
```

### Preload Assets for Better Performance
```jsx
import { assetPreloader } from '@/lib/assets';

function CourseIntro() {
  useEffect(() => {
    // Preload critical assets
    assetPreloader.preloadAssets([
      { type: 'image', src: '/assets/images/hero.jpg' },
      { type: 'audio', src: '/assets/audio/intro.mp3' },
      { type: 'video', src: '/assets/video/demo.mp4' }
    ]);
  }, []);

  return <div>Course content...</div>;
}
```

## Asset Content Types Reference

### Image Content Properties
- `src`: Asset path (required)
- `alt`: Alt text for accessibility (required)
- `title`: Image title
- `caption`: Caption text below image
- `width`: Image width (CSS value)
- `height`: Image height (CSS value)

### Audio Content Properties
- `src`: Asset path (required)
- `title`: Audio title
- `description`: Audio description
- `controls`: Show player controls (default: true)
- `autoplay`: Auto-play audio (default: false)
- `loop`: Loop audio (default: false)

### Video Content Properties
- `src`: Asset path (required)
- `title`: Video title
- `description`: Video description
- `controls`: Show player controls (default: true)
- `autoplay`: Auto-play video (default: false)
- `loop`: Loop video (default: false)
- `muted`: Mute video (default: false)

### Document Content Properties
- `src`: Asset path (required)
- `title`: Document title
- `description`: Document description
- `downloadable`: Allow download (default: true)

## Best Practices

1. **Optimize file sizes**:
   - Images: Use WebP format when possible
   - Audio: Use MP3 for compatibility
   - Video: Use MP4 with H.264 codec

2. **Use descriptive file names**:
   - `user-interface-mockup.png`
   - `course-introduction-audio.mp3`
   - `react-tutorial-part1.mp4`

3. **Provide alt text** for all images for accessibility

4. **Consider loading performance**:
   - Use smaller images for thumbnails
   - Preload critical assets
   - Use lazy loading for non-critical content

5. **Organize assets logically**:
   - Group related assets in subfolders if needed
   - Use consistent naming conventions
   - Document asset purposes in README files

## Troubleshooting

### Asset Not Loading
1. Check file path and spelling
2. Verify file is in correct assets folder
3. Ensure file format is supported
4. Check browser console for errors

### Performance Issues
1. Optimize file sizes
2. Use appropriate formats
3. Implement preloading for critical assets
4. Consider using CDN for large files

### Accessibility Issues
1. Always provide alt text for images
2. Include captions for audio/video when possible
3. Ensure sufficient color contrast
4. Test with screen readers