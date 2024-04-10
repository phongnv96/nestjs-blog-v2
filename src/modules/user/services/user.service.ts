import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { IUserService } from 'src/modules/user/interfaces/user.service.interface';
import {
    IDatabaseCreateOptions,
    IDatabaseExistOptions,
    IDatabaseFindAllOptions,
    IDatabaseFindOneOptions,
    IDatabaseGetTotalOptions,
    IDatabaseManyOptions,
    IDatabaseCreateManyOptions,
    IDatabaseSaveOptions,
} from 'src/common/database/interfaces/database.interface';
import {
    UserDoc,
    UserEntity,
} from 'src/modules/user/repository/entities/user.entity';
import { UserRepository } from 'src/modules/user/repository/repositories/user.repository';
import { HelperDateService } from 'src/common/helper/services/helper.date.service';
import { ConfigService } from '@nestjs/config';
import { HelperStringService } from 'src/common/helper/services/helper.string.service';
import { UserCreateDto } from 'src/modules/user/dtos/user.create.dto';
import { IAuthPassword } from 'src/common/auth/interfaces/auth.interface';
import { AwsS3Serialization } from 'src/common/aws/serializations/aws.s3.serialization';
import { UserUpdateNameDto } from 'src/modules/user/dtos/user.update-name.dto';
import {
    IUserDoc,
    IUserEntity,
} from 'src/modules/user/interfaces/user.interface';
import { UserPayloadSerialization } from 'src/modules/user/serializations/user.payload.serialization';
import { plainToInstance } from 'class-transformer';
import { RoleEntity } from 'src/modules/role/repository/entities/role.entity';
import { UserImportDto } from 'src/modules/user/dtos/user.import.dto';
import { UserUpdateUsernameDto } from 'src/modules/user/dtos/user.update-username.dto';
import { UserUpdateGoogleSSODto } from '../dtos/user.update-google-sso.dto';
import { ENUM_USER_STATUS_CODE_ERROR } from '../constants/user.status-code.constant';
import { ENUM_ROLE_STATUS_CODE_ERROR } from '../../role/constants/role.status-code.constant';
import { UserUpdateGithubSSODto } from '../dtos/user.update-gitgub-sso.dto';
import { UserUpdateFacebookSSODto } from '../dtos/user.update-facebook-sso.dto';

@Injectable()
export class UserService implements IUserService {
    private readonly uploadPath: string;
    private readonly authMaxPasswordAttempt: number;

    constructor(
        private readonly userRepository: UserRepository,
        private readonly helperDateService: HelperDateService,
        private readonly helperStringService: HelperStringService,
        private readonly configService: ConfigService,
    ) {
        this.uploadPath = this.configService.get<string>('user.uploadPath');
        this.authMaxPasswordAttempt = this.configService.get<number>(
            'auth.password.maxAttempt',
        );
    }

    async findAll(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions,
    ): Promise<IUserEntity[]> {
        return this.userRepository.findAll<IUserEntity>(find, {
            ...options,
            join: true,
        });
    }

    async findOneById<T>(
        _id: string,
        options?: IDatabaseFindOneOptions,
    ): Promise<T> {
        return this.userRepository.findOneById<T>(_id, options);
    }

    async findOne<T>(
        find: Record<string, any>,
        options?: IDatabaseFindOneOptions,
    ): Promise<T> {
        return this.userRepository.findOne<T>(find, options);
    }

    async findOneByUsername<T>(
        username: string,
        options?: IDatabaseFindOneOptions,
    ): Promise<T> {
        return this.userRepository.findOne<T>({ username }, options);
    }

    async findOneByEmail<T>(
        email: string,
        options?: IDatabaseFindOneOptions,
    ): Promise<T> {
        return this.userRepository.findOne<T>({ email }, options);
    }

    async findOneByMobileNumber<T>(
        mobileNumber: string,
        options?: IDatabaseFindOneOptions,
    ): Promise<T> {
        return this.userRepository.findOne<T>({ mobileNumber }, options);
    }

    async getTotal(
        find?: Record<string, any>,
        options?: IDatabaseGetTotalOptions,
    ): Promise<number> {
        return this.userRepository.getTotal(find, { ...options, join: true });
    }

    async create(
        {
            firstName,
            lastName,
            email,
            mobileNumber,
            role,
            signUpFrom,
            photo,
            isWaitingConfirmActivation,
        }: UserCreateDto,
        { passwordExpired, passwordHash, salt, passwordCreated }: IAuthPassword,
        options?: IDatabaseCreateOptions,
    ): Promise<UserDoc> {
        const create: UserEntity = new UserEntity();
        create.firstName = firstName;
        create.email = email;
        create.password = passwordHash;
        create.role = role;
        create.isActive = true;
        create.inactivePermanent = false;
        create.blocked = false;
        create.lastName = lastName;
        create.salt = salt;
        create.passwordExpired = passwordExpired;
        create.passwordCreated = passwordCreated;
        create.signUpDate = this.helperDateService.create();
        create.passwordAttempt = 0;
        create.mobileNumber = mobileNumber ?? undefined;
        create.signUpFrom = signUpFrom;
        create.photo = photo;
        create.isWaitingConfirmActivation = isWaitingConfirmActivation;

        return this.userRepository.create<UserEntity>(create, options);
    }

    async existByEmail(
        email: string,
        options?: IDatabaseExistOptions,
    ): Promise<boolean> {
        return this.userRepository.exists(
            {
                // email: {
                //     $regex: new RegExp(`\\b${email}\\b`),
                //     $options: 'i',
                // },
                email,
            },
            { ...options, withDeleted: true },
        );
    }

    async existByMobileNumber(
        mobileNumber: string,
        options?: IDatabaseExistOptions,
    ): Promise<boolean> {
        return this.userRepository.exists(
            {
                mobileNumber,
            },
            { ...options, withDeleted: true },
        );
    }

    async existByUsername(
        username: string,
        options?: IDatabaseExistOptions,
    ): Promise<boolean> {
        return this.userRepository.exists(
            { username },
            { ...options, withDeleted: true },
        );
    }

    async delete(
        repository: UserDoc,
        options?: IDatabaseSaveOptions,
    ): Promise<UserDoc> {
        return this.userRepository.softDelete(repository, options);
    }

    async updateName(
        repository: UserDoc,
        { firstName, lastName }: UserUpdateNameDto,
        options?: IDatabaseSaveOptions,
    ): Promise<UserDoc> {
        repository.firstName = firstName;
        repository.lastName = lastName;

        return this.userRepository.save(repository, options);
    }

    async updateUsername(
        repository: UserDoc,
        { username }: UserUpdateUsernameDto,
        options?: IDatabaseSaveOptions,
    ): Promise<UserDoc> {
        repository.username = username;

        return this.userRepository.save(repository, options);
    }

    async updatePhoto(
        repository: UserDoc,
        photo: AwsS3Serialization,
        options?: IDatabaseSaveOptions,
    ): Promise<UserDoc> {
        repository.photo = photo;

        return this.userRepository.save(repository, options);
    }

    async updatePassword(
        repository: UserDoc,
        { passwordHash, passwordExpired, salt, passwordCreated }: IAuthPassword,
        options?: IDatabaseSaveOptions,
    ): Promise<UserDoc> {
        repository.password = passwordHash;
        repository.passwordExpired = passwordExpired;
        repository.passwordCreated = passwordCreated;
        repository.salt = salt;

        return this.userRepository.save(repository, options);
    }

    async updateVerifyToken(
        repository: UserDoc,
        options?: IDatabaseSaveOptions,
    ): Promise<UserDoc> {
        repository.isWaitingConfirmActivation = false;
        return this.userRepository.save(repository, options);
    }


    async active(
        repository: UserDoc,
        options?: IDatabaseSaveOptions,
    ): Promise<UserEntity> {
        repository.isActive = true;
        repository.inactiveDate = undefined;

        return this.userRepository.save(repository, options);
    }

    async inactive(
        repository: UserDoc,
        options?: IDatabaseSaveOptions,
    ): Promise<UserDoc> {
        repository.isActive = false;
        repository.inactiveDate = this.helperDateService.create();

        return this.userRepository.save(repository, options);
    }

    async inactivePermanent(
        repository: UserDoc,
        options?: IDatabaseSaveOptions,
    ): Promise<UserDoc> {
        repository.isActive = false;
        repository.inactivePermanent = true;
        repository.inactiveDate = this.helperDateService.create();

        return this.userRepository.save(repository, options);
    }

    async blocked(
        repository: UserDoc,
        options?: IDatabaseSaveOptions,
    ): Promise<UserDoc> {
        repository.blocked = true;
        repository.blockedDate = this.helperDateService.create();

        return this.userRepository.save(repository, options);
    }

    async unblocked(
        repository: UserDoc,
        options?: IDatabaseSaveOptions,
    ): Promise<UserDoc> {
        repository.blocked = false;
        repository.blockedDate = undefined;

        return this.userRepository.save(repository, options);
    }

    async maxPasswordAttempt(
        repository: UserDoc,
        options?: IDatabaseSaveOptions,
    ): Promise<UserDoc> {
        repository.passwordAttempt = this.authMaxPasswordAttempt;

        return this.userRepository.save(repository, options);
    }

    async increasePasswordAttempt(
        repository: UserDoc,
        options?: IDatabaseSaveOptions,
    ): Promise<UserDoc> {
        repository.passwordAttempt = ++repository.passwordAttempt;

        return this.userRepository.save(repository, options);
    }

    async resetPasswordAttempt(
        repository: UserDoc,
        options?: IDatabaseSaveOptions,
    ): Promise<UserDoc> {
        repository.passwordAttempt = 0;

        return this.userRepository.save(repository, options);
    }

    async updatePasswordExpired(
        repository: UserDoc,
        passwordExpired: Date,
        options?: IDatabaseSaveOptions,
    ): Promise<UserDoc> {
        repository.passwordExpired = passwordExpired;

        return this.userRepository.save(repository, options);
    }

    async joinWithRole(repository: UserDoc): Promise<IUserDoc> {
        return repository.populate({
            path: 'role',
            localField: 'role',
            foreignField: '_id',
            model: RoleEntity.name,
        });
    }

    async createPhotoFilename(): Promise<Record<string, any>> {
        const filename: string = this.helperStringService.random(20);

        return {
            path: this.uploadPath,
            filename: filename,
        };
    }

    async payloadSerialization(
        data: IUserDoc,
    ): Promise<UserPayloadSerialization> {
        return plainToInstance(UserPayloadSerialization, data.toObject());
    }

    async import(
        data: UserImportDto[],
        role: string,
        { passwordCreated, passwordHash, salt }: IAuthPassword,
        options?: IDatabaseCreateManyOptions,
    ): Promise<boolean> {
        const passwordExpired: Date = this.helperDateService.backwardInDays(1);
        const users: UserEntity[] = data.map(
            ({ email, firstName, lastName, mobileNumber, signUpFrom }) => {
                const create: UserEntity = new UserEntity();
                create.firstName = firstName;
                create.email = email;
                create.password = passwordHash;
                create.role = role;
                create.isActive = true;
                create.inactivePermanent = false;
                create.blocked = false;
                create.lastName = lastName;
                create.salt = salt;
                create.passwordExpired = passwordExpired;
                create.passwordCreated = passwordCreated;
                create.signUpDate = this.helperDateService.create();
                create.passwordAttempt = 0;
                create.mobileNumber = mobileNumber ?? undefined;
                create.signUpFrom = signUpFrom;

                return create;
            },
        );

        return this.userRepository.createMany<UserEntity>(users, options);
    }

    async deleteMany(
        find: Record<string, any>,
        options?: IDatabaseManyOptions,
    ): Promise<boolean> {
        return this.userRepository.deleteMany(find, options);
    }

    async updateGoogleSSO(
        repository: UserDoc,
        { accessToken, refreshToken }: UserUpdateGoogleSSODto,
        options?: IDatabaseSaveOptions,
    ): Promise<UserDoc> {
        repository.google = {
            accessToken,
            refreshToken,
        };

        return this.userRepository.save(repository, options);
    }

    async updateGithubSSO(
        repository: UserDoc,
        { accessToken, refreshToken }: UserUpdateGithubSSODto,
        options?: IDatabaseSaveOptions,
    ): Promise<UserDoc> {
        repository.github = {
            accessToken,
            refreshToken,
        };

        return this.userRepository.save(repository, options);
    }

    async updateFacebookSSO(
        repository: UserDoc,
        { accessToken, refreshToken }: UserUpdateFacebookSSODto,
        options?: IDatabaseSaveOptions,
    ): Promise<UserDoc> {
        repository.facebook = {
            accessToken,
            refreshToken,
        };

        return this.userRepository.save(repository, options);
    }


    async checkExistUserByEmailAddress(email: string): Promise<any> {
        const user: UserDoc = await this.findOneByEmail(email);

        if (!user) {
            throw new NotFoundException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
                message: 'user.error.notFound',
            });
        } else if (user.blocked) {
            throw new ForbiddenException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_BLOCKED_ERROR,
                message: 'user.error.blocked',
            });
        } else if (user.inactivePermanent) {
            throw new ForbiddenException({
                statusCode:
                ENUM_USER_STATUS_CODE_ERROR.USER_INACTIVE_PERMANENT_ERROR,
                message: 'user.error.inactivePermanent',
            });
        } else if (!user.isActive) {
            throw new ForbiddenException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_INACTIVE_ERROR,
                message: 'user.error.inactive',
            });
        }

        const userWithRole: IUserDoc = await this.joinWithRole(user);
        if (!userWithRole.role.isActive) {
            throw new ForbiddenException({
                statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_INACTIVE_ERROR,
                message: 'role.error.inactive',
            });
        }
        return { user, userWithRole };
    }
}
