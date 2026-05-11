# Zelario

Zelario is a Web3 platform built with Next.js and React. It brings together decentralized trading (swap, liquidity, buy crypto), an NFT marketplace, social communities, quests, and profile rewards in one interface. Users can sign in with a Web3 wallet; separate admin and community-admin areas manage platform and community operations. Solidity contracts for the on-chain layer live in [`contracts/`](contracts/).

## How to run

Install dependencies once:

```bash
npm install
```

### Development — `npm run dev`

Starts the Next.js development server with hot reload. Use this while you are building or changing the app.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production — `npm start`

Serves an optimized production build. Build the app first, then start the server:

```bash
npm run build
npm start
```

The app is available at [http://localhost:3000](http://localhost:3000) (same port as development unless you set `PORT`).
