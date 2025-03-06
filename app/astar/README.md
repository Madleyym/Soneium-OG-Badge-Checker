# Soneium Badge Checker & Astar Surge Status

A Next.js application for checking Soneium OG/Premium Badge eligibility and Astar Surge campaign participation status.

![Soneium Badge Checker](public/screenshot-badge-checker.png)
![Astar Surge Status](public/screenshot-astar-surge.png)

## Features

### Soneium Badge Checker
- Check wallet eligibility for Soneium OG and Premium OG badges
- View transaction statistics and badge distribution status
- Export results to CSV
- View detailed transaction breakdown
- Dark/light mode support
- Search and history functionality

### Astar Surge Status Checker
- Check participation status in the Astar Surge pre-deposit campaign
- View detailed project participation information
- Monitor token claim status
- Track migration status between Astar Network and Soneium
- View withdrawal eligibility with timelock expiry tracking

## Technologies Used

- React.js 18
- Next.js 14
- TypeScript
- Tailwind CSS
- Lucide React (icon library)
- localStorage for theme persistence

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/Madleyym/Soneium-OG-Badge-Checker.git
cd soneium-badge-checker
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory (if needed)
```
# Add any environment variables here
```

4. Run the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
├── app/
│   ├── api/
│   │   └── check/
│   │       └── route.ts         # API endpoint for badge checking
│   ├── astar/
│   │   ├── components/
│   │   │   └── AstarSurgePromo.tsx  # Astar Surge component
│   │   └── page.tsx             # Astar Surge page
│   ├── components/
│   │   ├── BadgeStatus.tsx      # Badge status component
│   │   └── sections/
│   │       ├── FAQ.tsx          # FAQ section
│   │       └── UI/
│   │           └── Footer.tsx   # Footer component
│   └── page.tsx                 # Main page with badge checker
├── public/
│   └── assets/
│       └── astar/              # Astar-related icons
│           ├── astar-logo.png
│           ├── sake-logo.png
│           └── etc...
└── next.config.js
```

## Usage

### Badge Checker

1. Enter one or more Ethereum/Soneium wallet addresses (one per line)
2. Click "Check Eligibility & Badges"
3. Review the results showing eligibility status
4. Use search functionality to filter results
5. Export results to CSV if needed

### Astar Surge Status

1. Navigate to the Astar page
2. Enter your Astar wallet address
3. Click "Check Astar Surge Status"
4. Review participation status, deposits, and points
5. Expand project details to view more information
6. Check token claim status and withdrawal eligibility

## Deployment

The application can be deployed to Vercel, Netlify, or any hosting platform that supports Next.js applications.

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Soneium Network for the badge concept
- Astar Network for the Astar Surge campaign
- Lucide for the icon library
- Tailwind CSS for the styling framework