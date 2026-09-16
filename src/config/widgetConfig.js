export const widgetConfig = {
  integrator: 'raouf',
  apiKey: '3b7131cd-d41d-4c0c-ad06-d47f9ffecb40.1a3ecb84-82d0-4076-bab6-4440f9850dd8',
  variant: 'expandable',
  subvariant: 'default',
  appearance: 'dark',
  theme: {
    palette: {
      primary: { main: '#8b5cf6' },
      background: {
        paper: '#12131a',
        default: '#0a0b0e',
      },
    },
    shape: {
      borderRadius: 16,
      borderRadiusSecondary: 12,
    },
  },
  rpcUrls: {
    1: ['https://cloudflare-eth.com', 'https://rpc.ankr.com/eth'],
    137: ['https://polygon-bor-rpc.publicnode.com', 'https://rpc.ankr.com/polygon'],
    42161: ['https://arb1.arbitrum.io/rpc', 'https://rpc.ankr.com/arbitrum'],
    10: ['https://mainnet.optimism.io', 'https://rpc.ankr.com/optimism'],
    56: ['https://bsc-dataseed.binance.org', 'https://rpc.ankr.com/bsc'],
    8453: ['https://mainnet.base.org', 'https://developer-access-mainnet.base.org'],
  },
  sdkConfig: {
    apiKey: '3b7131cd-d41d-4c0c-ad06-d47f9ffecb40.1a3ecb84-82d0-4076-bab6-4440f9850dd8',
    defaultRouteOptions: {
      maxPriceImpact: 0.8,
      allowSwitchChain: true,
    },
  },
};
