import { Client } from 'ssh2';

export interface ConnectionConfig {
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    privateKey?: string;
}

export function createConnection(config?: ConnectionConfig): Promise<Client> {
    return new Promise((resolve, reject) => {
        const conn = new Client();
        conn
            .on('ready', () => {
                resolve(conn);
            })
            .on('error', (err) => {
                reject(err);
            })
            .connect({
                host: config?.host || process.env.SSH_HOST,
                port: config?.port || Number(process.env.SSH_PORT) || 22,
                username: config?.username || process.env.SSH_USERNAME,
                password: config?.password || process.env.SSH_PASSWORD,
                privateKey: config?.privateKey || process.env.SSH_PRIVATE_KEY,
            });
    });
}

export function executeCommand(command: string, config?: ConnectionConfig): Promise<string> {
    return new Promise((resolve, reject) => {
        const conn = new Client();
        conn
            .on('ready', () => {
                conn.exec(command, (err, stream) => {
                    if (err) {
                        conn.end();
                        return reject(err);
                    }
                    let stdout = '';
                    let stderr = '';
                    stream
                        .on('close', (code: any, signal: any) => {
                            conn.end();
                            if (code !== 0) {
                                reject(new Error(`Command failed with code ${code}: ${stderr}`));
                            } else {
                                resolve(stdout);
                            }
                        })
                        .on('data', (data: any) => {
                            stdout += data;
                        })
                        .stderr.on('data', (data: any) => {
                            stderr += data;
                        });
                });
            })
            .on('error', (err) => {
                reject(err);
            })
            .connect({
                host: config?.host || process.env.SSH_HOST,
                port: config?.port || Number(process.env.SSH_PORT) || 22,
                username: config?.username || process.env.SSH_USERNAME,
                password: config?.password || process.env.SSH_PASSWORD,
                privateKey: config?.privateKey || process.env.SSH_PRIVATE_KEY,
            });
    });
}
