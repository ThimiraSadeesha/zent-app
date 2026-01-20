import environment from '@/environments/environment';
import type { Environment } from '@/environments/environment';

export const config: Environment = environment;

export const isDevelopment = () => config.development;
export const isProduction = () => config.production;
export const isQA = () => config.qa;

export const getApiUrl = (endpoint: string = '') => {
    const baseUrl = config.apiUrl;
    if (!endpoint) return baseUrl;
    const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${cleanBase}/${cleanEndpoint}`;
};

export const log = (...args: any[]) => {
    if (config.enableLogging) {
        console.log('[Zent UI]', ...args);
    }
};

export const logError = (...args: any[]) => {
    if (config.enableLogging) {
        console.error('[Zent UI Error]', ...args);
    }
};

export const logWarning = (...args: any[]) => {
    if (config.enableLogging) {
        console.warn('[Zent UI Warning]', ...args);
    }
};

export const getEnvironmentInfo = () => ({
    name: config.production ? 'Production' : config.qa ? 'QA' : 'Development',
    isDevelopment: isDevelopment(),
    isProduction: isProduction(),
    isQA: isQA(),
    version: config.version,
    apiUrl: config.apiUrl,
    loggingEnabled: config.enableLogging,
    analyticsEnabled: config.enableAnalytics,
});

export type { Environment };