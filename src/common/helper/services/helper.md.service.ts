import { Injectable } from '@nestjs/common';
import { IHelperMdService } from '../interfaces/helper.md-service.interface';
import marked = require('marked');
import { ENUM_TIME_TO_READ } from '../constants/helper.enum.constant';

@Injectable()
export class HelperMdService implements IHelperMdService {
    async timeToRead(
        markdownContent: string,
        wordsPerMinute: number = ENUM_TIME_TO_READ.WORD_PER_MINUTE
    ): Promise<number> {
        const plainTextContent = (await marked.marked(
            markdownContent
        )) as string;
        const wordCount = plainTextContent.trim().split(/\s+/).length;
        const timeToRead = Math.ceil(wordCount / wordsPerMinute);
        return timeToRead;
    }
}
