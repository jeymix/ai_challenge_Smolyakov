export const ADMIN_CREDENTIALS = {
  login: process.env.ADMIN_LOGIN || "admin",
  password: process.env.ADMIN_PASSWORD || "admin123",
};

export const FIXED_ROUTES = {
  "Москва-Сочи": 200000,
  "Сочи-Москва": 200000,
  "Бишкек-Москва": 350000,
  "Москва-Бишкек": 350000,
};

export const DEFAULT_TARIFFS = {
  pricePerKmUnder1000: 150,
  pricePerKmOver1000: 100,
};

export const INSURANCE_RATE = 0.1; // 10%

export const KM_PER_DAY = 1000; // Норматив: 1000 км за 24 часа

