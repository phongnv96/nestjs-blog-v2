import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IGCPOauth2Service } from '../interfaces/gcp.oauth2.service.interface';
import { GoogleAuth, JWT } from 'google-auth-library';

@Injectable()
export class GoogleAuthService implements IGCPOauth2Service {
    private authClient;
    private readonly keyFilePath: string;
    private oauth2Client;

    constructor(private configService: ConfigService) {
        this.keyFilePath = this.configService.get<string>('mail.keyFilePath');
        this.initializeGoogleAuth();
    }

    private async initializeGoogleAuth() {
        try {
            // const auth = new GoogleAuth({
            //     keyFilename: this.keyFilePath,
            //     scopes: ['https://mail.google.com/'],
            // });
            //
            // this.authClient = await auth.getClient();

            this.authClient = new JWT({
                email: 'devcoblog@devcoblog.iam.gserviceaccount.com',
                key: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDkdxHlSpN1GICL\nvh1QyOzPcplAcY1Teh5jeyAEvZmdtMI63UcT22dp9OVtvHsyMES4qgmWFzcpZmA0\nC1xft8Mp3DYSdaOP/l6EQn2Ky+EgHyHOyMFJPZUKRddYZwCcm45M9ILAX327IDjW\nVxekUu9lgCC1f2B4IMu6mHGdswlo3nOvkBrJzFhICgqDbz+y1+y4jX8Ms8ls5+D6\nhM1WLoJE+UmQEkvxdltAA7VeFA0MEAeZ3WmUwG5iJs9RdQtfIdEeifS2ZSUK4Pyv\n05SdYPlYBjzeG4bxFsqFV6V2IVVYKW59YOb52Wfi0wZLfN8aENuODVm6jy2ytoIe\nfZL4QFO7AgMBAAECggEARqigy0aGVofOcenJjUunGf26chjsea3iKihRXcX59bGL\nBMOdEQIheL66GndZrssI5ggI0Pe7Ir278Ty2RBBEdvTZcFobzRQBzWv3Ae9OYC3g\nueCTDwDR0IyLLpcktErT9u8EZVTjQPWVPo1PDY5s5fp7o0aS4nRaLgqp0PknZtwY\nWQJWpioOFGSvLqNF1Oj3O0ip7fwoiPL/KCx/yWFOnvDu0axPNO8Y5mvf8vMYBB5C\nzF0JVYkC9lzuZwqCiGKF1QRNBJ5uduHwcE0L6o6kDqUmKG41YRw7l4S10Ouup5/b\n5IpuXywusge14EOTrS0UrfPh0G1vLZlGkAq23GVXuQKBgQDzFx1JZxBMYvcgzRIU\nrx/owH9vae4OPM0zjS21xyHsfHNJxSzeGhgNJA+y+YpoWw8l+aYoNVUIZPDit/dh\nnBdB/5Yv5x4AD6QtbABVnTkF4lqv1Jdw3h5QIi5yMHNOPTZhSKARLNhKMSJIvfdD\nViYO10BZ7lJ5EwREPF/EeID9VQKBgQDwmR8yu3pAyLwfw+XOstnGJ2tRuJicHc8f\naW3glNUjimoDjHbAt5MTbE8RX9A/BCgckBBiN2phtyPafQLT8qS7dV2oyNF38dkn\nZRl0R4wP790tW03UYXv/0+f/1ZgBlQAeAv/FrVik+QHw0Z4phC0PIq4iVlgrHoWx\neFxj38WMzwKBgBABVplNouIUpgbP2b/o4+X0Pq+8PsNLN4uMYRUV3mLusryJsfGR\nsEG1PR9glL9YN4AdltYQ5N9fngifajdQCqv6ww22XuBMJ1giQ0dfybBcffITwkDZ\nLw/BoGM+U2k0WI9BM+DNnhQMdiBp+YzCcFEL1R3WtjFokiBYBUovUPbdAoGAXO6o\nME5eAFwI3jQqtdY7a+CaAWzN9a9F65oriM20LhAutsQwsmu18ZCqUcmyhES0waOb\n0HQbMTcuMByNVRSqMIY68RDwZ+YQvLi+Rj3EiftacUSNIXWuEbjmKdl051eIPg9m\ngBJe5QoRh9VPxDV7uhbpL/YuBCm79jrJZQJwKd0CgYEApoHHJ7aoc6DqvU9P0guX\nlUBVOjctHQ+JoPMsU2ih/PPP9J/Uyg09Beb8PSE8b2TMMofjbcrSYyYZ0iWxUp6a\nJQPIZOL71EBF9/XeDKLSsYrpX4bFBXGcKyZsc74jo3Gmcmj3nTeirAoHDP2D0/Pl\nHAs+q+TgpPkA5ROB5BxKKj4=\n-----END PRIVATE KEY-----\n',
                scopes: ['https://www.googleapis.com/auth/gmail.send'],
            });
            //
            // const token = await client.getAccessToken();
            // console.log('Token:', token);
        } catch (error) {
            console.error('Error initializing Google Auth:', error);
        }
    }

    async getAuthToken(): Promise<string> {
        if (!this.authClient) {
            throw new Error('Google Auth client has not been initialized.');
        }

        await this.authClient.authorize();

        const accessToken = (await this.authClient.getAccessToken()).token;

        // const { token } = await this.authClient.getAccessToken(); // This ensures the token is populated
        // const tokenInfo = this.authClient.credentials;
        // if (!tokenInfo.access_token) {
        //     throw new Error('Access token is not available.');
        // }
        return accessToken;
    }
}
