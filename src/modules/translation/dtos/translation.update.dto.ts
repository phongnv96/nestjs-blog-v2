import { ApiHideProperty } from '@nestjs/swagger';
import { TranslationCreateDto } from './translation.create.dto';

export class TranslationUpdateDto extends TranslationCreateDto {
    // add _id as hiddenapi
    @ApiHideProperty()
    readonly _id?: string;
}
