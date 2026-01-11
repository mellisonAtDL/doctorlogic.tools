# doctorlogic.tools

Internal tools portal for DoctorLogic employees. Built with Next.js 16, TypeScript, and Tailwind CSS.

## Features

- ✅ Next.js 16 with App Router
- ✅ TypeScript support
- ✅ Tailwind CSS v4 for styling
- ✅ No-indexing configured (robots.txt + meta tags)
- ✅ ESLint for code quality

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
doctorlogic.tools/
├── app/              # Next.js app directory
│   ├── layout.tsx    # Root layout with metadata
│   ├── page.tsx      # Home page
│   └── globals.css   # Global styles
├── public/           # Static assets
│   └── robots.txt    # Search engine indexing rules
└── ...config files
```

## Security & Privacy

This application is configured to prevent search engine indexing:
- `robots.txt` with `Disallow: /`
- Meta tags: `noindex, nofollow, nocache`
- Googlebot-specific directives

**Note:** This is for internal use only and should not be publicly accessible.