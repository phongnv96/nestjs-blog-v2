import {
    Body,
    ConflictException,
    Controller,
    ForbiddenException,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException, Param,
    Post,
    Res,
} from '@nestjs/common';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { ClientSession, Connection } from 'mongoose';
import { ApiKeyPublicProtected } from 'src/common/api-key/decorators/api-key.decorator';
import {
    ENUM_AUTH_LOGIN_FROM,
    ENUM_AUTH_LOGIN_WITH,
} from 'src/common/auth/constants/auth.enum.constant';
import { AuthJwtPayload } from 'src/common/auth/decorators/auth.jwt.decorator';
import {
    IAuthGithubPayload,
    IAuthGooglePayload,
} from 'src/common/auth/interfaces/auth.interface';
import { AuthService } from 'src/common/auth/services/auth.service';
import { ENUM_ERROR_STATUS_CODE_ERROR } from 'src/common/error/constants/error.status-code.constant';
import { Response } from 'src/common/response/decorators/response.decorator';
import { ENUM_ROLE_STATUS_CODE_ERROR } from 'src/modules/role/constants/role.status-code.constant';
import { RoleService } from 'src/modules/role/services/role.service';
import { ENUM_USER_SIGN_UP_FROM } from 'src/modules/user/constants/user.enum.constant';
import { ENUM_USER_STATUS_CODE_ERROR } from 'src/modules/user/constants/user.status-code.constant';
import { UserPublicSignUpDoc, UserPublicVerifyToken } from 'src/modules/user/docs/user.public.doc';
import { UserSignUpDto } from 'src/modules/user/dtos/user.sign-up.dto';
import { UserService } from 'src/modules/user/services/user.service';
import { IUserDoc } from '../interfaces/user.interface';
import { UserDoc } from '../repository/entities/user.entity';
import { UserPayloadSerialization } from '../serializations/user.payload.serialization';
import { AuthGoogleOAuth2LoginProtected } from 'src/common/auth/decorators/auth.google.decorator';
import { DatabaseConnection } from 'src/common/database/decorators/database.decorator';
import { Response as ExResponse } from 'express';
import {
    AuthFacebookOAuth2LoginProtected,
} from '../../../common/auth/decorators/auth.facebook.decorator';
import { AuthGithubOAuth2SignUpProtected } from '../../../common/auth/decorators/auth.github.decorator';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../../../common/mail/services/mail.service';
import { AuthAccessPayloadSerialization } from '../../../common/auth/serializations/auth.access-payload.serialization';
import {
    AuthRefreshPayloadSerialization,
} from '../../../common/auth/serializations/auth.refresh-payload.serialization';

@ApiTags('modules.public.user')
@Controller({
    version: '1',
    path: '/user',
})
export class UserPublicController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
        private readonly roleService: RoleService,
        private readonly configService: ConfigService,
        private readonly mailService: MailService,
        @DatabaseConnection() private readonly databaseConnection: Connection,
    ) {
    }

    @UserPublicSignUpDoc()
    @Response('user.signUp')
    @ApiKeyPublicProtected()
    @Post('/sign-up')
    async signUp(
        @Body()
            { email, mobileNumber, ...body }: UserSignUpDto,
    ): Promise<void> {
        const promises: Promise<any>[] = [
            this.roleService.findOneByName('user'),
            this.userService.existByEmail(email),
        ];

        if (mobileNumber) {
            promises.push(this.userService.existByMobileNumber(mobileNumber));
        }

        const [role, emailExist, mobileNumberExist] = await Promise.all(
            promises,
        );

        if (emailExist) {
            throw new ConflictException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_EMAIL_EXIST_ERROR,
                message: 'user.error.emailExist',
            });
        } else if (mobileNumberExist) {
            throw new ConflictException({
                statusCode:
                ENUM_USER_STATUS_CODE_ERROR.USER_MOBILE_NUMBER_EXIST_ERROR,
                message: 'user.error.mobileNumberExist',
            });
        }

        const password = await this.authService.createPassword(body.password);

        const user = await this.userService.create(
            {
                email,
                mobileNumber,
                signUpFrom: ENUM_USER_SIGN_UP_FROM.PUBLIC,
                role: role._id,
                isWaitingConfirmActivation: true,
                ...body,
            },
            password,
        );

        const loginDate: Date = await this.authService.getLoginDate();
        const payloadAccessToken: AuthAccessPayloadSerialization =
            await this.authService.createPayloadAccessToken(user, {
                loginDate,
                loginWith: ENUM_AUTH_LOGIN_WITH.EMAIL,
                loginFrom: ENUM_AUTH_LOGIN_FROM.EMAIL,
            });

        const token = await this.authService.createAccessToken(payloadAccessToken);

        await this.mailService.sendUserConfirmation(user, token);

        return;
    }

    @UserPublicVerifyToken()
    @Get('/verify-token/:token')
    @ApiKeyPublicProtected()
    async verifyToken(@Param('token') token: string) {
        const verifyToken = await this.authService.validateAccessToken(token);
        const payloadVerifyToken = await this.authService.payloadAccessToken(token);
        if (!verifyToken || !payloadVerifyToken) {
            throw new NotFoundException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.TOKEN_INVALID_ERROR,
                message: 'token.error.invalidToken',
            });
        }

        const user: UserDoc = await this.userService.findOneByEmail(payloadVerifyToken?.data?.user?.email);
        if (!user) {
            throw new NotFoundException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
                message: 'user.error.notFound',
            });
        }

        if (!user.isWaitingConfirmActivation) {
            throw new ForbiddenException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_ALREADY_ACTIVATED_ERROR,
                message: 'user.error.alreadyActivated',
            });
        }

        await this.userService.updateVerifyToken(user);

        const userWithRole: IUserDoc = await this.userService.joinWithRole(
            user,
        );

        if (!userWithRole.role.isActive) {
            throw new ForbiddenException({
                statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_INACTIVE_ERROR,
                message: 'role.error.inactive',
            });
        }

        const payload: UserPayloadSerialization =
            await this.userService.payloadSerialization(userWithRole);
        const tokenType: string = await this.authService.getTokenType();
        const expiresIn: number =
            await this.authService.getAccessTokenExpirationTime();
        const loginDate: Date = await this.authService.getLoginDate();
        const payloadAccessToken: AuthAccessPayloadSerialization =
            await this.authService.createPayloadAccessToken(payload, {
                loginWith: ENUM_AUTH_LOGIN_WITH.EMAIL,
                loginFrom: ENUM_AUTH_LOGIN_FROM.PASSWORD,
                loginDate,
            });
        const payloadRefreshToken: AuthRefreshPayloadSerialization =
            await this.authService.createPayloadRefreshToken(
                payload._id,
                payloadAccessToken,
            );

        const payloadEncryption = await this.authService.getPayloadEncryption();
        let payloadHashedAccessToken: AuthAccessPayloadSerialization | string =
            payloadAccessToken;
        let payloadHashedRefreshToken:
            | AuthRefreshPayloadSerialization
            | string = payloadRefreshToken;

        if (payloadEncryption) {
            payloadHashedAccessToken =
                await this.authService.encryptAccessToken(payloadAccessToken);
            payloadHashedRefreshToken =
                await this.authService.encryptRefreshToken(payloadRefreshToken);
        }

        const roleType = userWithRole.role.type;
        const accessToken: string = await this.authService.createAccessToken(
            payloadHashedAccessToken,
        );
        const refreshToken: string = await this.authService.createRefreshToken(
            payloadHashedRefreshToken,
        );

        const checkPasswordExpired: boolean =
            await this.authService.checkPasswordExpired(user.passwordExpired);

        if (checkPasswordExpired) {
            throw new ForbiddenException({
                statusCode:
                ENUM_USER_STATUS_CODE_ERROR.USER_PASSWORD_EXPIRED_ERROR,
                message: 'user.error.passwordExpired',
            });
        }
        return {
            data: {
                tokenType,
                roleType,
                expiresIn,
                accessToken,
                refreshToken,
            },
        };
    }


    @Response('user.loginGoogle')
    @AuthGoogleOAuth2LoginProtected()
    @Get('/login/google')
    async loginGoogle(): Promise<void> {
        return;
    }

    @Response('user.loginGoogleCallback')
    @AuthGoogleOAuth2LoginProtected()
    @Get('/login/google/callback')
    async loginGoogleCallback(
        @AuthJwtPayload()
            {
                email,
                firstName,
                lastName,
                accessToken: googleAccessToken,
                refreshToken: googleRefreshToken,
                photo,
            }: IAuthGooglePayload,
        @Res() res: ExResponse,
    ): Promise<any> {
        const promises: Promise<any>[] = [
            this.roleService.findOneByName('user'),
            this.userService.existByEmail(email),
        ];
        const [role, emailExist] = await Promise.all(promises);

        // if user not exist, create new user
        if (!emailExist) {
            try {
                const passwordString =
                    await this.authService.createPasswordRandom();
                const password = await this.authService.createPassword(
                    passwordString,
                );

                const user: UserDoc = await this.userService.create(
                    {
                        email,
                        firstName,
                        lastName,
                        photo,
                        password: passwordString,
                        role: role._id,
                        signUpFrom: ENUM_USER_SIGN_UP_FROM.GOOGLE,
                    },
                    password,
                    // { session }
                );

                await this.userService.updateGoogleSSO(
                    user,
                    {
                        accessToken: googleAccessToken,
                        refreshToken: googleRefreshToken,
                    },
                    // { session }
                );

                // await session.commitTransaction();
                // await session.endSession();
            } catch (err: any) {
                // await session.abortTransaction();
                // await session.endSession();

                throw new InternalServerErrorException({
                    statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
                    message: 'http.serverError.internalServerError',
                    _error: err.message,
                });
            }
        }

        const { user, userWithRole } =
            await this.userService.checkExistUserByEmailAddress(email);

        await this.userService.updateGoogleSSO(user, {
            accessToken: googleAccessToken,
            refreshToken: googleRefreshToken,
        });

        const payload: UserPayloadSerialization =
            await this.userService.payloadSerialization(userWithRole);
        const loginDate: Date = await this.authService.getLoginDate();
        // generate token
        const token: string = await this.authService.generateDataToken(
            user,
            payload,
            {
                loginWith: ENUM_AUTH_LOGIN_WITH.GOOGLE,
                loginFrom: ENUM_AUTH_LOGIN_FROM.GOOGLE,
                loginDate: loginDate,
            },
        );

        // set token to cookie redirect to client
        res.cookie('token', JSON.stringify({ data: token }), {
            path: '/',
            maxAge: this.configService.get('auth.refreshToken.expirationTime'), // e.g., one week
        });

        res.redirect(this.configService.get('client.domain'));

        return;
    }

    @ApiExcludeEndpoint()
    @Response('user.loginFacebook')
    @AuthFacebookOAuth2LoginProtected()
    @Get('/login/facebook')
    async loginFacebook(): Promise<void> {
        return;
    }

    @ApiExcludeEndpoint()
    @Response('user.signUpFacebookCallback')
    @AuthFacebookOAuth2LoginProtected()
    @HttpCode(HttpStatus.CREATED)
    @Get('/login/facebook/callback')
    async loginFacebookCallback(
        @AuthJwtPayload()
            {
                email,
                firstName,
                lastName,
                accessToken,
                refreshToken,
                photo: AwsS3Serialization,
            }: IAuthGooglePayload,
        @Res() res: ExResponse,
    ): Promise<void> {
        // sign up

        const promises: Promise<any>[] = [
            this.roleService.findOneByName('user'),
            this.userService.existByEmail(email),
        ];

        const [role, emailExist] = await Promise.all(promises);

        // const session: ClientSession =
        //     await this.databaseConnection.startSession();
        // session.startTransaction();
        let user: UserDoc;
        if (!emailExist) {
            try {
                const passwordString =
                    await this.authService.createPasswordRandom();
                const password = await this.authService.createPassword(
                    passwordString,
                );

                user = await this.userService.create(
                    {
                        email,
                        firstName,
                        lastName,
                        password: passwordString,
                        role: role._id,
                        signUpFrom: ENUM_USER_SIGN_UP_FROM.GOOGLE,
                    },
                    password,
                    // { session }
                );

                await this.userService.updateFacebookSSO(
                    user,
                    {
                        accessToken,
                        refreshToken,
                    },
                    // { session }
                );

                // await session.commitTransaction();
                // await session.endSession();

                const userWithRole: IUserDoc = await this.userService.joinWithRole(
                    user,
                );
                if (!userWithRole.role.isActive) {
                    throw new ForbiddenException({
                        statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_INACTIVE_ERROR,
                        message: 'role.error.inactive',
                    });
                }

                await this.userService.updateFacebookSSO(user, {
                    accessToken,
                    refreshToken,
                });

            } catch (err: any) {
                // await session.abortTransaction();
                // await session.endSession();

                throw new InternalServerErrorException({
                    statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
                    message: 'http.serverError.internalServerError',
                    _error: err.message,
                });
            }
        }

        // if (!user) {
        user = await this.userService.findOneByEmail(email);
        // }

        const userWithRole: IUserDoc = await this.userService.joinWithRole(
            user,
        );

        if (!userWithRole.role.isActive) {
            throw new ForbiddenException({
                statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_INACTIVE_ERROR,
                message: 'role.error.inactive',
            });
        }

        await this.userService.updateFacebookSSO(user, {
            accessToken,
            refreshToken,
        });

        const payload: UserPayloadSerialization =
            await this.userService.payloadSerialization(userWithRole);
        const loginDate: Date = await this.authService.getLoginDate();
        const token: string = await this.authService.generateDataToken(
            user,
            payload,
            {
                loginWith: ENUM_AUTH_LOGIN_WITH.FACEBOOK,
                loginFrom: ENUM_AUTH_LOGIN_FROM.FACEBOOK,
                loginDate: loginDate,
            },
        );

        res.cookie('token', JSON.stringify({ data: token }), {
            path: '/',
            maxAge: this.configService.get(
                'auth.refreshToken.expirationTime',
            ),
        });
        res.redirect(this.configService.get('client.domain'));

        return;

    }

    @ApiExcludeEndpoint()
    @Response('user.loginGithub')
    @AuthGithubOAuth2SignUpProtected()
    @Get('/login/github')
    async signUpGithub(): Promise<void> {
        return;
    }

    @ApiExcludeEndpoint()
    @Response('user.loginGithubCallback')
    @AuthGithubOAuth2SignUpProtected()
    @HttpCode(HttpStatus.CREATED)
    @Get('/login/github/callback')
    async signUpGithubCallback(
        @AuthJwtPayload()
            {
                email,
                firstName,
                lastName,
                photo,
                accessToken: githubAccessToken,
                refreshToken: githubRefreshToken,
            }: IAuthGithubPayload,
        @Res() res: ExResponse,
    ): Promise<void> {
        // sign up

        const promises: Promise<any>[] = [
            this.roleService.findOneByName('user'),
            this.userService.existByEmail(email),
        ];

        const [role, emailExist] = await Promise.all(promises);

        // const session: ClientSession =
        //     await this.databaseConnection.startSession();
        // session.startTransaction();
        let user: UserDoc;
        try {
            // if user not exist, create new user
            if (!emailExist) {
                const passwordString =
                    await this.authService.createPasswordRandom();
                const password = await this.authService.createPassword(
                    passwordString,
                );

                user = await this.userService.create(
                    {
                        email,
                        firstName,
                        lastName,
                        photo,
                        password: passwordString,
                        role: role._id,
                        signUpFrom: ENUM_USER_SIGN_UP_FROM.GITHUB,
                    },
                    password,
                    // { session }
                );

                await this.userService.updateGithubSSO(
                    user,
                    {
                        accessToken: githubAccessToken,
                        refreshToken: githubRefreshToken,
                    },
                    // { session }
                );
            }

            // await session.commitTransaction();
            // await session.endSession();
            // if (!user) {
            user = await this.userService.findOneByEmail(email);
            // }

            const userWithRole: IUserDoc = await this.userService.joinWithRole(
                user,
            );

            if (!userWithRole.role.isActive) {
                throw new ForbiddenException({
                    statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_INACTIVE_ERROR,
                    message: 'role.error.inactive',
                });
            }

            await this.userService.updateGithubSSO(user, {
                accessToken: githubAccessToken,
                refreshToken: githubRefreshToken,
            });

            const payload: UserPayloadSerialization =
                await this.userService.payloadSerialization(userWithRole);
            const loginDate: Date = await this.authService.getLoginDate();
            const token: string = await this.authService.generateDataToken(
                user,
                payload,
                {
                    loginWith: ENUM_AUTH_LOGIN_WITH.GITHUB,
                    loginFrom: ENUM_AUTH_LOGIN_FROM.GITHUB,
                    loginDate: loginDate,
                },
            );

            res.cookie('token', JSON.stringify({ data: token }), {
                path: '/',
                maxAge: this.configService.get(
                    'auth.refreshToken.expirationTime',
                ),
            });
            res.redirect(this.configService.get('client.domain'));
        } catch (err: any) {
            // await session.abortTransaction();
            // await session.endSession();

            throw new InternalServerErrorException({
                statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
                message: 'http.serverError.internalServerError',
                _error: err.message,
            });
        }

        return;
    }
}
