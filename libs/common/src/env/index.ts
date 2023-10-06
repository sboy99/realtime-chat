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
// Redis
export const REDIS_URI = str;
// RabbitMQ
export const RABBITMQ_URI = str;
// Secrets
export const COOKIE_SECRET = str;
// Jwt
export const JWT_SECRET = str;
export const JWT_ACCESS_TOKEN_EXPIRY = str;
export const JWT_REFRESH_TOKEN_EXPIRY = str;
// Elastic Search
export const ELASTIC_SEARCH_NODE = str;
export const ELASTIC_SEARCH_INDEX = str;
export const ELASTIC_SEARCH_USER = str;
export const ELASTIC_SEARCH_PASSWORD = str;
// export const ELASTIC_SEARCH_NODE = str;
