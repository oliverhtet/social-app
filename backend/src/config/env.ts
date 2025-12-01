// config/env.js
import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
  port: number;
  dbUri: string;
  jwtSecret: string;
}

const config: EnvConfig = {
  port: Number(process.env.PORT),
  dbUri: process.env.DATABASE_URL!,
  jwtSecret: process.env.JWT_SECRET!,
} ;

export default config;
