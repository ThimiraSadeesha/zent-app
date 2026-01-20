
import { Environment } from './environment';

const environment: Environment = {
    production: false,
    development: true,
    qa: false,
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    appName: process.env.NEXT_PUBLIC_APP_NAME || 'Zent UI - Development',
    apiTimeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 30000,
    enableLogging: true,
    enableAnalytics: false,
    version: process.env.NEXT_PUBLIC_VERSION || '1.0.0-dev',
};

export default environment;