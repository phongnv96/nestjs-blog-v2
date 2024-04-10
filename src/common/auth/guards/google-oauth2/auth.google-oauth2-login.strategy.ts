import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Profile } from 'passport';
import { IAuthGooglePayload } from 'src/common/auth/interfaces/auth.interface';

@Injectable()
export class AuthGoogleOAuth2LoginStrategy extends PassportStrategy(
    Strategy,
    'googleLogin'
) {
    constructor(private readonly configService: ConfigService) {
        super({
            clientID: configService.get<string>('google.clientId'),
            clientSecret: configService.get<string>('google.clientSecret'),
            callbackURL: configService.get<string>('google.callbackLoginUrl'),
            scope: ['profile', 'email', 'openid'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: VerifyCallback
    ): Promise<any> {
        const { name, emails } = profile;
        console.log('profile google: ', profile);
        const user: IAuthGooglePayload = {
            photo: {
                completedUrl: profile?.photos?.[0]?.value,
            },
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            accessToken,
            refreshToken,
        };

        done(null, user);
    }
}
