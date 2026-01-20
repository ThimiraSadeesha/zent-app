export interface Environment {
    production: boolean;
    development: boolean;
    qa: boolean;
    apiUrl: string;
    appName: string;
    apiTimeout: number;
    enableLogging: boolean;
    enableAnalytics: boolean;
    version: string;
}

const environment: Environment = {
    production: false,
    development: true,
    qa: false,
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    appName: process.env.NEXT_PUBLIC_APP_NAME || 'Zent UI',
    apiTimeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 30000,
    enableLogging: process.env.NEXT_PUBLIC_ENABLE_LOGGING === 'true',
    enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    version: process.env.NEXT_PUBLIC_VERSION || '1.0.0',
};

export default environment;