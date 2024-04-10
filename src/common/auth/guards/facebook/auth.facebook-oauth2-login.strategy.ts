import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Profile } from 'passport';
import { IAuthFacebookPayload } from 'src/common/auth/interfaces/auth.interface';

@Injectable()
export class AuthFacebookOAuth2LoginStrategy extends PassportStrategy(
    Strategy,
    'facebookLogin'
) {
    constructor(private readonly configService: ConfigService) {
        super({
            clientID: configService.get<string>('facebook.clientId'),
            clientSecret: configService.get<string>('facebook.clientSecret'),
            callbackURL: configService.get<string>(
                'facebook.callbackLoginUrl'
            ),
            scope: ['email', 'public_profile'],
            profileFields: ['id', 'displayName', 'picture', 'email', 'name']
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done:  (error: any, user?: any, info?: any) => void,
    ): Promise<any> {
        console.log('profile facebook', profile);
        const { name } = profile;
        const user: IAuthFacebookPayload = {
            firstName: name.givenName,
            lastName: name.familyName,
            accessToken,
            refreshToken,
            email: profile.emails?.[0]?.value,
            photo:  { completedUrl: profile.photos?.[0]?.value }
        };

        done(null, user);
    }
}
