import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthFacebookOauth2SignUpGuard } from '../guards/facebook/auth.facebook-oauth2.guard';
import { AuthFacebookOauth2LoginGuard } from '../guards/facebook/auth.facebook-oauth2-login.guard';

export function AuthFacebookOAuth2SignUpProtected(): MethodDecorator {
    return applyDecorators(UseGuards(AuthFacebookOauth2SignUpGuard));
}


export function AuthFacebookOAuth2LoginProtected(): MethodDecorator {
    return applyDecorators(UseGuards(AuthFacebookOauth2LoginGuard));
}
