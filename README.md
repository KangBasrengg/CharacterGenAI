<div align="center">
  <br />
  <h1>✨ CharGen AI ✨</h1>
  <p><strong>The Ultimate AI-Powered 3D Character Studio</strong></p>
  <p>Generate highly detailed 2D concepts and transform them into production-ready 3D models in seconds.</p>
</div>

<br/>

## 🚀 Overview

**CharGen AI** is a premium, full-stack web application built for game developers, animators, and VTubers. With a state-of-the-art glassmorphic UI, it seamlessly combines text-to-image AI (via Replicate) with image-to-3D AI (via Tripo) to create a complete character generation pipeline.

## 🌟 Key Features

- **Text-to-2D Generation:** Describe your character and let AI generate stunning concept art.
- **2D-to-3D Conversion:** Turn any generated concept into a fully realized 3D `.glb` model.
- **Premium Glassmorphic UI:** A gorgeous, responsive, dark-themed interface built with CSS Grid and Framer Motion.
- **Secure Authentication:** Integrated with Supabase Auth (OAuth Google & Email/Password) featuring PKCE flow.
- **Asset Library:** A built-in dashboard to view, download, and manage all your generated assets.
- **Credits System:** Real-time generation credit tracking tied directly to your Supabase profile.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, Server Actions)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database & Auth:** [Supabase](https://supabase.com/) & `@supabase/ssr`
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **AI Providers:** [Replicate API](https://replicate.com/) (2D) & [Tripo API](https://www.tripo3d.ai/) (3D)
- **Deployment:** [Netlify](https://www.netlify.com/)

## ⚙️ Environment Variables

To run this project locally, create a `.env.local` file in the root directory and add the following keys:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI API Tokens
REPLICATE_API_TOKEN=your_replicate_api_key
TRIPO_API_KEY=your_tripo_api_key
```

## 💻 Running Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/KangBasrengg/CharacterGenAI.git
   cd CharacterGenAI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application in action.

## 🌐 Deployment

This project is fully optimized for **Netlify**. A `netlify.toml` file is included to automatically handle Next.js builds and Edge routing. Ensure all environment variables above are added to your Netlify Site Settings before deploying.

---
<div align="center">
  <p>Built with ❤️ by <a href="https://github.com/KangBasrengg">KangBasrengg</a></p>
</div>
