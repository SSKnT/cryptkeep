# CryptKeep - Capture The Flag Web Challenge

CryptKeep is an interactive Capture The Flag (CTF) web application where users can test their cybersecurity skills through various challenges, earning flags as they solve puzzles.

![CryptKeep Logo](public/flags-1.png)

## Features

- **Interactive Challenges**: Four unique security and cryptography challenges
  - Binary Pattern Challenge
  - Hidden Flag Challenge
  - Privacy Policy Challenge
  - Cryptography Decoding Challenge
- **Leaderboard**: Track your progress against other players
- **User Profiles**: Create and manage your profile
- **Real-time Scoring**: See your flag captures update in real-time
- **Authentication**: Secure sign-up and login with Supabase

## Technologies Used

- **Frontend**: Next.js, React
- **Styling**: TailwindCSS with custom theme
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Animations**: Canvas Confetti for celebrations
- **Forms**: React Hook Form for form validation
- **UI Components**: Custom components with Lucide React icons

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account for backend services

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/cryptkeep.git
cd cryptkeep
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `/src/components` - React components
  - `/Sections` - Main challenge sections of the application
- `/src/hooks` - Custom React hooks including flag context
- `/src/lib` - Utility functions and API clients
- `/src/pages` - Next.js pages and API routes
- `/src/styles` - Global styles and TailwindCSS configuration

## Challenges

The application includes four hidden flags that can be discovered through:

1. **Binary Pattern** - Find the correct binary pattern on the welcome page
2. **Hidden Flag** - Located within UI elements in the How to Play section
3. **Privacy Guru** - Complete the privacy policy quiz with at least 70% correct answers
4. **Cryptography Master** - Decrypt a substitution cipher with a shifting pattern

## Database Schema

The application uses two main tables in Supabase:

- `profiles` - User profile information
- `user_flags` - Tracks which flags users have found and when

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

1. Push your code to a GitHub repository
2. Connect to Vercel and deploy
3. Configure the environment variables in the Vercel dashboard

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [React Hook Form](https://react-hook-form.com/)
