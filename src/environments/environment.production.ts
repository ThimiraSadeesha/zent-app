import { Environment } from './environment';

const environment: Environment = {
    production: true,
    development: false,
    qa: false,
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.zentui.com/api',
    appName: process.env.NEXT_PUBLIC_APP_NAME || 'Zent UI',
    apiTimeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 30000,
    enableLogging: false,
    enableAnalytics: true,
    version: process.env.NEXT_PUBLIC_VERSION || '1.0.0',
};

export default environment;