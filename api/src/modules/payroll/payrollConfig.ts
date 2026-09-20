export const PAYROLL_CONFIG = {
  STANDARD_WORKING_DAYS: 26,

  DEFAULT_COMMISSION_RATE: 3,

  INSURANCE_RATES: {
    social: 0.08, // BHXH
    unemployment: 0.01, // BHTN
    health: 0.015, // BHYT
  },

  PERSONAL_DEDUCTION: 15_500_000,
  DEPENDENT_DEDUCTION: 6_200_000,

  PIT_BRACKETS: [
    { upTo: 10_000_000, rate: 0.05 },
    { upTo: 30_000_000, rate: 0.1 },
    { upTo: 60_000_000, rate: 0.2 },
    { upTo: 100_000_000, rate: 0.3 },
    { upTo: Infinity, rate: 0.35 },
  ],
} as const;
