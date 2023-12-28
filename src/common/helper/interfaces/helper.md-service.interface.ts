export interface IHelperMdService {
    timeToRead(content: string, wordsPerMinute: number): Promise<number>;
}
