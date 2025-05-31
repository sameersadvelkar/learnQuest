# Assets Directory

This directory contains static assets for the educational LMS platform.

## Structure

```
assets/
├── images/          # Image files (jpg, png, gif, svg, webp)
├── audio/           # Audio files (mp3, wav, ogg)
├── video/           # Video files (mp4, webm, mov)
└── documents/       # Document files (pdf, doc, txt)
```

## Usage

### Importing Assets in Components

```jsx
// Import images
import logoImage from '@/assets/images/logo.png';
import diagramSvg from '@/assets/images/diagram.svg';

// Import audio
import notificationSound from '@/assets/audio/notification.mp3';

// Import video
import introVideo from '@/assets/video/intro.mp4';

// Use in component
function MyComponent() {
  return (
    <div>
      <img src={logoImage} alt="Logo" />
      <video src={introVideo} controls />
      <audio src={notificationSound} />
    </div>
  );
}
```

### Using Assets in Content JSON

```json
{
  "content": {
    "type": "image",
    "src": "@/assets/images/example.png",
    "alt": "Example image",
    "caption": "This is an example image"
  }
}
```

## File Naming Conventions

- Use lowercase with hyphens: `user-profile.png`
- Be descriptive: `react-component-diagram.svg`
- Include dimensions for images when helpful: `hero-banner-1920x1080.jpg`

## Supported Formats

### Images
- **PNG** - Best for graphics with transparency
- **JPG/JPEG** - Best for photographs
- **SVG** - Best for icons and simple graphics
- **WebP** - Modern format with better compression
- **GIF** - For simple animations

### Audio
- **MP3** - Universal compatibility
- **WAV** - High quality, larger files
- **OGG** - Open source alternative

### Video
- **MP4** - Universal compatibility
- **WebM** - Modern format with better compression
- **MOV** - High quality, often larger files

### Documents
- **PDF** - For reading materials and handouts
- **TXT** - Plain text files
- **MD** - Markdown documentation