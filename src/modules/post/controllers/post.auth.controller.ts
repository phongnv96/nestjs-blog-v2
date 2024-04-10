import {
    Body,
    ConflictException,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Put,
    UploadedFile,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiKeyPublicProtected } from 'src/common/api-key/decorators/api-key.decorator';
import {
    AuthJwtAccessProtected,
    AuthJwtAdminAccessProtected, AuthJwtUserAccessProtected,
} from 'src/common/auth/decorators/auth.jwt.decorator';
import {
    ENUM_POLICY_ACTION,
    ENUM_POLICY_SUBJECT,
} from 'src/common/policy/constants/policy.enum.constant';
import { PolicyAbilityProtected } from 'src/common/policy/decorators/policy.decorator';
import { RequestParamGuard } from 'src/common/request/decorators/request.decorator';
import { Response } from 'src/common/response/decorators/response.decorator';
import { IResponse } from 'src/common/response/interfaces/response.interface';

import { PostCreateDto } from '../dtos/post.create.dto';
import { PostEntity } from '../repository/entities/post.entity';
import { PostService } from '../services/post.service';
import { PostGetSerialization } from '../serializations/post.get.serializations';
import { GetPost } from '../decorators/post.decorator';
import { PostRequestDto } from '../dtos/post.request.dto';
import {
    PostAdminClapDoc,
    PostAdminCreateDoc,
    PostDetailGetDoc,
    PostUploadProfileDoc,
} from '../docs/post.docs';
import { ENUM_POST_STATUS_CODE_ERROR } from '../constants/post.status-code.constant';
import { AwsS3Serialization } from 'src/common/aws/serializations/aws.s3.serialization';
import { FileUploadSingle } from 'src/common/file/decorators/file.decorator';
import { FileRequiredPipe } from 'src/common/file/pipes/file.required.pipe';
import { FileSizeImagePipe } from 'src/common/file/pipes/file.size.pipe';
import { FileTypeImagePipe } from 'src/common/file/pipes/file.type.pipe';
import { IFile } from 'src/common/file/interfaces/file.interface';
import { AwsS3Service } from 'src/common/aws/services/aws.s3.service';
import {
    GetUser,
    UserProtected,
} from 'src/modules/user/decorators/user.decorator';
import { UserDoc } from 'src/modules/user/repository/entities/user.entity';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';
import { GCPStorageService } from '../../../common/gcp/services/gcp.storage.service';
import { PostClapDto } from '../dtos/post.clap.dto';

@ApiTags('modules.auth.post')
@Controller({
    version: '1',
    path: '/post',
})
export class PostAuthController {
    constructor(
        private readonly PostService: PostService,
        private readonly awsS3Service: AwsS3Service,
        private readonly gcpStorageService: GCPStorageService,
    ) {
    }

    @PostDetailGetDoc()
    @Response('post.get', {
        serialization: PostGetSerialization,
    })
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.POST,
        action: [ENUM_POLICY_ACTION.READ],
    })
    @AuthJwtAdminAccessProtected()
    @ApiKeyPublicProtected()
    @RequestParamGuard(PostRequestDto)
    @Get('get/:post')
    async get(@GetPost(true) Post: PostEntity): Promise<IResponse> {
        return { data: Post };
    }

    @PostAdminCreateDoc()
    @Response('post.create', {
        serialization: ResponseIdSerialization,
    })
    @UserProtected()
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.POST,
        action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.CREATE],
    })
    @AuthJwtAdminAccessProtected()
    @ApiKeyPublicProtected()
    @Post('/create')
    async create(
        @GetUser() user: UserDoc,
        @Body()
            { photo, tags, thumbnail, translations, categories }: PostCreateDto,
    ): Promise<IResponse> {
        const exist: boolean = await this.PostService.existByTitle(
            translations.map((item) => item.title),
        );
        if (exist) {
            throw new ConflictException({
                statusCode: ENUM_POST_STATUS_CODE_ERROR.POST_EXIST_ERROR,
                message: 'post.error.exist',
            });
        }
        const author = user._id;
        const create = await this.PostService.create({
            author,
            photo,
            tags,
            thumbnail,
            translations,
            categories,
        });

        return {
            data: { _id: create._id },
        };
    }

    @PostAdminCreateDoc()
    @Response('post.create', {
        serialization: ResponseIdSerialization,
    })
    @UserProtected()
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.POST,
        action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.CREATE],
    })
    @AuthJwtAdminAccessProtected()
    @ApiKeyPublicProtected()
    @Put('/update')
    async update(
        @GetUser() user: UserDoc,
        @Body()
            { photo, tags, thumbnail, translations, categories, _id }: PostCreateDto,
    ): Promise<IResponse> {
        const exist = await this.PostService.findOneById(_id);
        if (!exist) {
            throw new ConflictException({
                statusCode: ENUM_POST_STATUS_CODE_ERROR.POST_NOT_FOUND_ERROR,
                message: 'post.not.found',
            });
        }
        const author = user._id;
        const update = await this.PostService.update(exist, {
            author,
            photo,
            tags,
            thumbnail,
            translations,
            categories,
        });

        return {
            data: { _id: update._id },
        };
    }

    @PostAdminClapDoc()
    @Response('post.clap', {
        serialization: ResponseIdSerialization,
    })
    @UserProtected()
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.POST,
        action: [ENUM_POLICY_ACTION.MANAGE],
    })
    @AuthJwtUserAccessProtected()
    @ApiKeyPublicProtected()
    @Put('/clap')
    async clap(
        @GetUser() user: UserDoc,
        @Body()
            { _id, clap }: PostClapDto,
    ): Promise<IResponse> {
        const exist = await this.PostService.findOneById(_id);
        if (!exist) {
            throw new ConflictException({
                statusCode: ENUM_POST_STATUS_CODE_ERROR.POST_NOT_FOUND_ERROR,
                message: 'post.not.found',
            });
        }
        const author = user._id;
        const claps = exist.claps;
        const index = claps.findIndex((item) => item.author === author);
        if (index !== -1) {
            claps[index].clap = parseInt(clap);
        } else {
            claps.push({ author, clap: parseInt(clap) });
        }
        const update = await this.PostService.update(exist, {
            ...exist.toObject(),
            claps,
        });

        return {
            data: { _id: update._id },
        };
    }

    @PostUploadProfileDoc()
    @Response('post.upload', {
        serialization: AwsS3Serialization,
    })
    @UserProtected()
    @AuthJwtAccessProtected()
    @FileUploadSingle()
    @ApiKeyPublicProtected()
    @HttpCode(HttpStatus.OK)
    @Post('/upload')
    async upload(
        @GetUser() user: UserDoc,
        @UploadedFile(FileRequiredPipe, FileSizeImagePipe, FileTypeImagePipe)
            file: IFile,
    ): Promise<IResponse> {
        const filename: string = file.originalname;
        const content: Buffer = file.buffer;
        const mime: string = filename
            .substring(filename.lastIndexOf('.') + 1, filename.length)
            .toLowerCase();

        const path = await this.PostService.createPhotoFilename();

        const aws: AwsS3Serialization = await this.gcpStorageService.uploadFile(
            `${path.filename}.${mime}`,
            file,
            {
                path: `${path.path}/${user._id}`,
                ContentType: file.mimetype,
            },
        );

        return {
            data: aws,
        };
    }
}
