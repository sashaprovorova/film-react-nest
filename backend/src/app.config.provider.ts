export const CONFIG = 'CONFIG';

export const configProvider = {
  provide: CONFIG,
  useValue: {
    database: {
      driver: process.env.DATABASE_DRIVER || 'mongodb',
      url: process.env.DATABASE_URL || 'mongodb://localhost:27017/film',
    },
  },
};

export interface AppConfig {
  database: {
    driver: string;
    url: string;
  };
}
