import {
    ENUM_AUTH_LOGIN_FROM,
    ENUM_AUTH_LOGIN_WITH,
} from 'src/common/auth/constants/auth.enum.constant';
import { AwsS3Serialization } from '../../aws/serializations/aws.s3.serialization';

// Auth
export interface IAuthPassword {
    salt: string;
    passwordHash: string;
    passwordExpired: Date;
    passwordCreated: Date;
}

export interface IAuthPayloadOptions {
    loginWith: ENUM_AUTH_LOGIN_WITH;
    loginFrom: ENUM_AUTH_LOGIN_FROM;
    loginDate: Date;
}

export interface IAuthRefreshTokenOptions {
    // in milis
    notBeforeExpirationTime?: number | string;
}

export interface IAuthGooglePayload {
    email: string;
    firstName: string;
    lastName: string;
    accessToken: string;
    refreshToken: string;
    photo?: any;
}

export interface IAuthFacebookPayload {
    firstName: string;
    lastName: string;
    accessToken: string;
    refreshToken: string;
    email: string;
    photo?: any;
}

export interface IAuthGithubPayload {
    email: string;
    firstName: string;
    lastName?: string;
    accessToken: string;
    refreshToken: string;
    photo?: any;
}
