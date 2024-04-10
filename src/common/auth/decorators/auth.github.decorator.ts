import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGithubOauth2SignUpGuard } from '../guards/github/auth.github-oauth2.guard';

export function AuthGithubOAuth2SignUpProtected(): MethodDecorator {
    return applyDecorators(UseGuards(AuthGithubOauth2SignUpGuard));
}
