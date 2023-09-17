import { z } from 'zod';

const str = z.string();
const num = z.coerce.number();
// const bool = z.boolean();

export const NODE_ENV = z.enum(['development', 'production']);
// Database
export const POSTGRES_HOST = str;
export const POSTGRES_PORT = num;
export const POSTGRES_DB = str;
export const POSTGRES_USER = str;
export const POSTGRES_PASSWORD = str;

export const HTTP_PORT = num;
// RabbitMQ
export const RABBITMQ_URI = str;
// Secrets
export const COOKIE_SECRET = str;
