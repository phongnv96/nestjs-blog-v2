import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { CallbackWithoutResultAndOptionalError, Document } from 'mongoose';
import { DatabaseMongoUUIDEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.uuid.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { HelperMdService } from 'src/common/helper/services/helper.md.service';

export const TranslationDatabaseName = 'translations';

@DatabaseEntity({ collection: TranslationDatabaseName })
export class TranslationEntity extends DatabaseMongoUUIDEntityAbstract {
    @Prop({ type: String, required: true })
    language: string;

    @Prop({ type: String })
    slug: string;

    @Prop({ type: String, required: true })
    title: string;

    @Prop({ type: String, required: true })
    description: string;

    @Prop({ type: String, required: true })
    content: string;

    @Prop({ type: Number })
    timeToRead: number;
}

export const TranslationSchema =
    SchemaFactory.createForClass(TranslationEntity);

export type TranslationDoc = TranslationEntity & Document;

TranslationSchema.pre(
    'validate',
    async function (next: CallbackWithoutResultAndOptionalError) {
        this.slug = this.title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '-');
        console.log(
            'title to slug: ',
            this.title.toLowerCase().replace(/\s+/g, '-')
        );
        const helperMd = new HelperMdService();
        this.timeToRead = await helperMd.timeToRead(this.content);

        next();
    }
);
