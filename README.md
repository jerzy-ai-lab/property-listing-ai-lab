# Property Listing App

**Live Demo:** [property-listing-react.netlify.app](https://property-listing-react.netlify.app/)

Modern property listing application built with React and TypeScript. Search vacation rentals using AI-powered natural language queries, or browse and filter by location, guest capacity, and superhost status.

## Features

- AI-powered natural language search
- Filter by location, guest count, and superhost status
- Interactive Google Maps integration
- Property details page
- User authentication (sign up)
- User profile with image upload
- Contact form with Firestore integration
- Responsive design with modern UI

## Tech Stack

- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vitejs.dev)
- CSS Modules
- Custom React Hooks
- [Firebase (Firestore + Authentication)](https://firebase.google.com)
- [Google Maps API](https://developers.google.com/maps) - Interactive maps for property locations
- [Firebase Functions](https://firebase.google.com/docs/functions) - Backend AI search API
- [Google Gemini AI](https://ai.google.dev) - Embeddings for vector search
- [Cloudinary](https://cloudinary.com) - Image upload and storage for user profiles
- [Zod](https://zod.dev) - Schema validation for forms
- [React Hook Form](https://react-hook-form.com) - Form state management and validation
- [Lucide React](https://lucide.dev) - Icon library
- [clsx](https://github.com/lukeed/clsx) - Conditional classnames utility

## Firebase Setup

1. Create a project in the [Firebase Console](https://console.firebase.google.com/) and enable:
   - **Firestore Database**
   - **Authentication** (Email/Password provider)
2. Copy the web app config from **Project settings → General**.
3. Create `.env.local` and add:

   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   # Optional – Firebase Functions region (default: europe-north1)
   # VITE_FIREBASE_FUNCTIONS_REGION=europe-north1
   VITE_GOOGLE_MAPS_API_KEY=your_api_key
   VITE_CLOUDINARY_NAME=your_cloudinary_cloud_name
   # Optional – SEO base URL (default: https://property-listing-react.netlify.app in production)
   # VITE_APP_URL=https://property-listing-react.netlify.app
   ```

4. Configure backend secret for Functions:

   ```bash
   firebase functions:secrets:set GEMINI_API_KEY
   ```

5. Create Firestore vector index for `properties.embedding` with dimension `768`.

## AI Search (New)

- Search runs on backend via Firebase Function `searchProperties`.
- Function uses Gemini embeddings + Firestore vector search (`embedding`, 768 dimensions).
- `onPropertyWrite` automatically refreshes embeddings after property create/update.

## Getting Started

```bash
# Install dependencies
npm install

# Start development servers
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```
