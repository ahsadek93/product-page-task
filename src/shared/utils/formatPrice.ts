// ponytail: EGP hardcoded (EasyOrders store currency); read it from store settings if multi-currency stores matter
const egp = new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP', currencyDisplay: 'narrowSymbol' });

export const formatPrice = (amount: number) => egp.format(amount);
