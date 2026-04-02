export const mockTransactions = [
  // --- MAIN SAVINGS (acc_1) ---
  { id: 101, date: '2026-03-29', description: 'Monthly Salary', amount: 5000, category: 'Income', type: 'income', accountId: 'acc_1' },
  { id: 102, date: '2026-03-28', description: 'Rent Payment', amount: 1800, category: 'Housing', type: 'expense', accountId: 'acc_1' },
  { id: 103, date: '2026-03-27', description: 'Whole Foods Market', amount: 156.40, category: 'Food & Dining', type: 'expense', accountId: 'acc_1' },
  { id: 104, date: '2026-03-26', description: 'Amazon Order', amount: 124.99, category: 'Shopping', type: 'expense', accountId: 'acc_1' },
  { id: 105, date: '2026-03-25', description: 'Gas Station', amount: 45.00, category: 'Transportation', type: 'expense', accountId: 'acc_1' },
  { id: 106, date: '2026-03-24', description: 'Starbucks Coffee', amount: 6.50, category: 'Food & Dining', type: 'expense', accountId: 'acc_1' },
  { id: 107, date: '2026-03-23', description: 'Netflix Subscription', amount: 15.99, category: 'Entertainment', type: 'expense', accountId: 'acc_1' },
  { id: 108, date: '2026-03-22', description: 'Internet Bill', amount: 80.00, category: 'Utilities', type: 'expense', accountId: 'acc_1' },
  { id: 109, date: '2026-03-21', description: 'Gym Membership', amount: 50.00, category: 'Health & Fitness', type: 'expense', accountId: 'acc_1' },
  { id: 110, date: '2026-03-20', description: 'Blue Apron', amount: 60.00, category: 'Food & Dining', type: 'expense', accountId: 'acc_1' },
  { id: 111, date: '2026-03-18', description: 'Electric Bill', amount: 112.50, category: 'Utilities', type: 'expense', accountId: 'acc_1' },
  { id: 112, date: '2026-03-15', description: 'Target Shopping', amount: 210.30, category: 'Shopping', type: 'expense', accountId: 'acc_1' },
  { id: 113, date: '2026-03-12', description: 'Local Bar & Grill', amount: 42.15, category: 'Food & Dining', type: 'expense', accountId: 'acc_1' },
  { id: 114, date: '2026-03-10', description: 'Water Bill', amount: 40.00, category: 'Utilities', type: 'expense', accountId: 'acc_1' },
  { id: 115, date: '2026-03-05', description: 'Car Insurance', amount: 120.00, category: 'Transportation', type: 'expense', accountId: 'acc_1' },

  // --- DIGITAL WALLET (acc_2) ---
  { id: 201, date: '2026-03-30', description: 'Freelance Project', amount: 1200, category: 'Income', type: 'income', accountId: 'acc_2' },
  { id: 202, date: '2026-03-29', description: 'Uber Ride', amount: 24.50, category: 'Transportation', type: 'expense', accountId: 'acc_2' },
  { id: 203, date: '2026-03-28', description: 'Coffee Shop', amount: 4.25, category: 'Food & Dining', type: 'expense', accountId: 'acc_2' },
  { id: 204, date: '2026-03-27', description: 'App Store Purchase', amount: 0.99, category: 'Shopping', type: 'expense', accountId: 'acc_2' },
  { id: 205, date: '2026-03-25', description: 'Steam Game Sale', amount: 29.99, category: 'Entertainment', type: 'expense', accountId: 'acc_2' },
  { id: 206, date: '2026-03-23', description: 'Venmo Pizza Night', amount: 15.00, category: 'Food & Dining', type: 'expense', accountId: 'acc_2' },
  { id: 207, date: '2026-03-20', description: 'Pharmacy', amount: 12.80, category: 'Health & Fitness', type: 'expense', accountId: 'acc_2' },
  { id: 410, date: '2026-03-20', description: 'Marketing: Meta Ads', amount: 5000, category: 'Entertainment', type: 'expense', accountId: 'acc_1' },
  { id: 411, date: '2026-03-19', description: 'Apple Inc. Hardware', amount: 12500, category: 'Shopping', type: 'expense', accountId: 'acc_1' },
  { id: 412, date: '2026-03-18', description: 'WeWork: HQ Office', amount: 8500.00, category: 'Housing', type: 'expense', accountId: 'acc_1' },
  { id: 413, date: '2026-03-17', description: 'Salesforce CRM', amount: 450, category: 'Utilities', type: 'expense', accountId: 'acc_1' },
  { id: 414, date: '2026-03-16', description: 'Delta Air: Biz Travel', amount: 1200, category: 'Transportation', type: 'expense', accountId: 'acc_1' },
  { id: 415, date: '2026-03-15', description: 'Consulting: McKinsey', amount: 45000, category: 'Housing', type: 'expense', accountId: 'acc_1' },
  { id: 416, date: '2026-03-14', description: 'Employee Payroll Q1', amount: 125000, category: 'Housing', type: 'expense', accountId: 'acc_1' },
  { id: 417, date: '2026-03-12', description: 'Angel Investor Inflow', amount: 50000, category: 'Income', type: 'income', accountId: 'acc_3' },
  { id: 418, date: '2026-03-10', description: 'Starbucks: Team Meet', amount: 85.50, category: 'Food & Dining', type: 'expense', accountId: 'acc_2' },
  { id: 419, date: '2026-03-08', description: 'HackerOne: Bug Bounty', amount: 1500, category: 'Utilities', type: 'expense', accountId: 'acc_1' },
  { id: 420, date: '2026-03-05', description: 'Oracle Database Lic', amount: 12000, category: 'Utilities', type: 'expense', accountId: 'acc_1' },
  { id: 209, date: '2026-03-10', description: 'Bus Pass Refresh', amount: 30.00, category: 'Transportation', type: 'expense', accountId: 'acc_2' },
  { id: 210, date: '2026-03-05', description: 'Gas Utility', amount: 35.00, category: 'Utilities', type: 'expense', accountId: 'acc_2' },

  // --- INVESTMENT PORT (acc_3) ---
  { id: 301, date: '2026-03-31', description: 'Apple Stock Div', amount: 450, category: 'Income', type: 'income', accountId: 'acc_3' },
  { id: 302, date: '2026-03-30', description: 'Vanguard ETF Buy', amount: 1000, category: 'Savings/Investment', type: 'expense', accountId: 'acc_3' },
  { id: 303, date: '2026-03-28', description: 'Brokerage Int. Credit', amount: 12.45, category: 'Income', type: 'income', accountId: 'acc_3' },
  { id: 304, date: '2026-03-25', description: 'Tesla Dividend', amount: 85, category: 'Income', type: 'income', accountId: 'acc_3' },
  { id: 305, date: '2026-03-20', description: 'Crypto Staking Reward', amount: 5.20, category: 'Income', type: 'income', accountId: 'acc_3' },
  { id: 306, date: '2026-03-15', description: 'Gold bullion re-balance', amount: 500, category: 'Savings/Investment', type: 'expense', accountId: 'acc_3' },
  { id: 307, date: '2026-03-10', description: 'Nvidia Dividend', amount: 110, category: 'Income', type: 'income', accountId: 'acc_3' },
  { id: 308, date: '2026-03-05', description: 'S&P 500 Contribution', amount: 2000, category: 'Savings/Investment', type: 'expense', accountId: 'acc_3' },
  { id: 309, date: '2026-03-01', description: 'Real Estate Fund Dist.', amount: 300, category: 'Income', type: 'income', accountId: 'acc_3' },
];

export const mockCategories = [
  'Food & Dining',
  'Shopping',
  'Transportation',
  'Entertainment',
  'Housing',
  'Utilities',
  'Health & Fitness',
  'Income',
  'Savings/Investment'
];

export const categoryColors = {
  'Food & Dining': '#FFBC02',
  'Shopping': '#00A3FF',
  'Transportation': '#00D1FF',
  'Entertainment': '#7F3DFF',
  'Housing': '#00E096',
  'Utilities': '#91919F',
  'Health & Fitness': '#FD3C4A',
  'Income': '#00E096',
  'Savings/Investment': '#00A3FF'
};

export const currencies = [
  { code: 'USD', symbol: '$', rate: 1, name: 'US Dollar' },
  { code: 'EUR', symbol: '€', rate: 0.92, name: 'Euro' },
  { code: 'GBP', symbol: '£', rate: 0.79, name: 'British Pound' },
  { code: 'INR', symbol: '₹', rate: 83.35, name: 'Indian Rupee' },
  { code: 'JPY', symbol: '¥', rate: 151.48, name: 'Japanese Yen' }
];
