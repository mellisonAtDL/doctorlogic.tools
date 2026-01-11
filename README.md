# DoctorLogic Tools

Internal tools for managing client assets and resources.

## Logo Optimizer

A tool that takes any uploaded logo and optimizes it to work on both light and dark backgrounds, outputting a transparent PNG.

### Features

- **Background Removal**: Automatically removes backgrounds using Stability AI
- **Auto-Trim**: Removes transparent padding so logos fill their bounding box
- **Color Analysis**: Detects if logos are dark, light, or mixed
- **3 Variations**:
  - **Original + Outline**: Preserves exact brand colors with white outline
  - **Balanced**: Subtle color lightening with adaptive outline
  - **High Contrast**: Aggressive optimization for maximum visibility

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file with your Stability AI API key:
   ```
   STABILITY_API_KEY=sk-your-api-key-here
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000/logo-optimizer](http://localhost:3000/logo-optimizer)

### Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Sharp** - Image processing
- **chroma-js** - Color manipulation (LAB color space)
- **Stability AI** - Background removal API

### Cost

- Stability AI background removal: ~$0.02 per image
