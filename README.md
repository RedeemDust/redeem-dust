# RedeemDust

RedeemDust is a free, open-source tool for batch redeeming your dust positions on Polymarket using your Safe wallet. Enter your proxy Safe address, fetch your positions, and redeem up to 30 at a time in a single transaction. All transactions are signed by you and executed on the Polygon network.

- **Support:** redeemdust@proton.me
- **Tip address (Polygon USDC):** 0x4745BED9080A47cdf2e8280fD57Dd49237305916
- **Open-source on GitHub:** https://github.com/RedeemDust

## Features

- Connect to Polygon network using MetaMask or other web3 wallets
- Look up dust positions for any Safe address on Polymarket
- View redeemable position details including market info and values
- Batch redeem multiple dust positions in a single transaction (max 30 positions per batch)
- Fee calculation and transparent processing

## Technologies Used

- React 18
- TypeScript
- Tailwind CSS with shadcn/ui components
- ethers.js for blockchain interactions
- Polymarket API integration

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/redeem-dust.git
cd redeem-dust

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

### Production Build

```bash
# Create optimized production build
npm run build:static

# Preview the production build locally
npx serve dist
```

## Deployment to GitHub Pages

This project is configured for easy deployment to GitHub Pages:

1. Push your code to GitHub
2. Enable GitHub Pages in repository settings
3. The GitHub Actions workflow will automatically build and deploy your site

Alternatively, you can manually deploy:

```bash
# Build the project
npm run build:static

# Deploy to GitHub Pages (if you have gh-pages package installed)
npm run deploy
```

## Environment Variables

The application uses the following environment variables:

- `VITE_POSITIONS_ENDPOINT` - Polymarket API endpoint (defaults to "https://data-api.polymarket.com/positions")
- `VITE_SIZE_THRESHOLD_DEFAULT` - Minimum size threshold for dust positions (defaults to 0)
- `VITE_RPC_URL` - Custom RPC URL for Polygon network (optional)

## User Flow

1. Enter your proxy Safe address (not your regular wallet address).
2. Fetch your dust positions.
3. Select and redeem up to 30 positions at a time.
4. Sign the transaction with your wallet.
5. (Optional) Send a tip to the address above to support development!

## License

MIT License - See LICENSE file for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.