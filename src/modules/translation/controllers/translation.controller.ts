import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import { TranslationService } from '../services/translation.service';
import { TranslationGetSerialization } from '../serializations/translation.get.serilizations';
import { TranslationCreateDto } from '../dtos/translation.create.dto';

@Controller('translation')
export class TranslationController {
    constructor(private readonly translationService: TranslationService) {}

    @Get()
    async getAll(): Promise<TranslationGetSerialization[]> {
        return this.translationService.findAll();
    }

    @Get(':id')
    async getOne(
        @Param('id') id: string
    ): Promise<TranslationGetSerialization> {
        return this.translationService.findOneById(id);
    }

    @Post()
    async create(@Body() createDto: TranslationCreateDto) {
        return this.translationService.create(createDto);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateDto: TranslationCreateDto
    ) {
        const translation = await this.translationService.findOneById(id);
        return this.translationService.update(translation, updateDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        const translation = await this.translationService.findOneById(id);
        return this.translationService.delete(translation);
    }
}
