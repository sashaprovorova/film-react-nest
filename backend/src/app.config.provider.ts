export const CONFIG = 'CONFIG';

export const configProvider = {
  provide: CONFIG,
  useValue: {
    database: {
      driver: process.env.DATABASE_DRIVER || 'postgres',
      url: process.env.DATABASE_URL || 'mongodb://localhost:27017/film',
      username: process.env.DATABASE_USERNAME || 'filmuser',
      password: process.env.DATABASE_PASSWORD || 'film_nest',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432'),
      name: process.env.DATABASE_NAME || 'filmdb',
    },
  },
};

export interface AppConfig {
  database: {
    driver: string;
    url: string;
    username?: string;
    password?: string;
    host?: string;
    port?: number;
    name?: string;
  };
}
