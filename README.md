# ProceShark

A mission tracking and blogging application with AI-powered insights.

## Features

- User authentication with Supabase
- Mission tracking with daily updates
- Blog posting and commenting
- AI-powered insights for mission progress
- Real-time updates via Supabase realtime

## Development Setup

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/proces-shark.git
cd proces-shark
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment Variables**

Copy the example environment file and update with your own values:

```bash
cp .env.example .env.local
```

Required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon/public key
- `DEEPSEEK_API_KEY`: Your DeepSeek API key for AI functionality

4. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deployment to Vercel

1. **Push your code to GitHub**

2. **Connect your repository to Vercel**

   - Go to [Vercel](https://vercel.com) and sign up/log in
   - Click "New Project" and import your GitHub repository
   - Configure your project (add environment variables from `.env.example`)
   - Deploy

3. **Environment Variables on Vercel**
   - Add all the required environment variables in Vercel's project settings
   - Ensure `NEXT_PUBLIC_APP_URL` is set to your Vercel deployment URL

## Project Structure

- `/app`: Next.js app router pages and API routes
- `/components`: Reusable React components
- `/lib`: Utility functions and business logic
- `/types`: TypeScript type definitions
- `/utils`: Helper utilities (URL handling, Supabase clients)

## Technologies Used

- Next.js 14
- TypeScript
- Supabase (Auth, Database, Realtime)
- Tailwind CSS
- DeepSeek AI API
- Framer Motion
