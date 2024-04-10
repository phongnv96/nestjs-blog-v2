import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Profile } from 'passport';
import {
    IAuthGithubPayload,
} from 'src/common/auth/interfaces/auth.interface';

@Injectable()
export class AuthGithubOauth2SignUpStrategy extends PassportStrategy(
    Strategy,
    'githubSignUp'
) {
    constructor(private readonly configService: ConfigService) {
        super({
            clientID: configService.get<string>('github.clientId'),
            clientSecret: configService.get<string>('github.clientSecret'),
            callbackURL: configService.get<string>('github.callbackLoginUrl'),
            scope: ['profile', 'email', 'openid'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done:  (error: any, user?: any, info?: any) => void,
    ): Promise<any> {
        console.log('profile git', profile);
        const { displayName, photos, username } = profile;
        const user: IAuthGithubPayload = {
            email: profile.emails?.[0]?.value || username,
            firstName: displayName,
            accessToken,
            refreshToken,
            photo: {
                completedUrl: photos?.[0]?.value,
            },
        };

        done(null, user);
    }
}
