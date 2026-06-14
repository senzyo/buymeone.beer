export const creator = {
  name: 'Someone',
  avatar: '/assets/avatar.jpg',
  links: [
    'https://somewhere',
  ],
};

export const currencies = {
  // USDT: { enabled: true, icon: '/assets/USDT.svg' },
  // USDC: { enabled: true, icon: '/assets/USDC.svg' },
  USD: { enabled: true, icon: '/assets/USD.svg' },
  CNY: { enabled: true, icon: '/assets/CNY.svg' },
  EUR: { enabled: true, icon: '/assets/EUR.svg' },
  GBP: { enabled: true, icon: '/assets/GBP.svg' },
  RUB: { enabled: true, icon: '/assets/RUB.svg' }
} as const;

export type CurrencyCode = keyof typeof currencies;

export const enabledCurrencies = Object.entries(currencies)
  .filter(([, v]) => v.enabled)
  .map(([code, v]) => ({ code: code as CurrencyCode, icon: v.icon }));
