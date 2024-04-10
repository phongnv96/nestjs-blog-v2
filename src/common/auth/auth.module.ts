import { DynamicModule, Module } from '@nestjs/common';
import { AuthJwtAccessStrategy } from 'src/common/auth/guards/jwt-access/auth.jwt-access.strategy';
import { AuthJwtRefreshStrategy } from 'src/common/auth/guards/jwt-refresh/auth.jwt-refresh.strategy';
import { AuthService } from 'src/common/auth/services/auth.service';
import { AuthGoogleOAuth2LoginStrategy } from './guards/google-oauth2/auth.google-oauth2-login.strategy';
import { AuthGoogleOAuth2SignUpStrategy } from './guards/google-oauth2/auth.google-oath2-sign-up.strategy';
import { AuthFacebookOAuth2SignUpStrategy } from './guards/facebook/auth.facebook-oauth2-sign-up.strategy';
import { AuthGithubOauth2SignUpStrategy } from './guards/github/auth.github-oauth2-sign-up.strategy';
import { AuthFacebookOAuth2LoginStrategy } from './guards/facebook/auth.facebook-oauth2-login.strategy';

@Module({
    providers: [AuthService],
    exports: [AuthService],
    controllers: [],
    imports: [],
})
export class AuthModule {
    static forRoot(): DynamicModule {
        return {
            module: AuthModule,
            providers: [
                AuthJwtAccessStrategy,
                AuthJwtRefreshStrategy,
                AuthGoogleOAuth2SignUpStrategy,
                AuthGoogleOAuth2LoginStrategy,
                AuthFacebookOAuth2SignUpStrategy,
                AuthFacebookOAuth2LoginStrategy,
                AuthGithubOauth2SignUpStrategy,
            ],
            exports: [],
            controllers: [],
            imports: [],
        };
    }
}
