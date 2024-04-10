import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { IGCPStorageService } from '../interfaces/gcp.storage-service.inteface';
import { ConfigService } from '@nestjs/config';
import { IFile } from '../../file/interfaces/file.interface';

@Injectable()
export class GCPStorageService implements IGCPStorageService {
    private readonly storage: Storage;
    private readonly bucketName: string;
    private readonly keyFilePath: string;
    private readonly baseUrl: string;

    constructor(private readonly configService: ConfigService) {
        this.bucketName = this.configService.get<string>('google.gcpBucketName');
        this.keyFilePath = this.configService.get<string>('google.gcpKeyFilePath');
        this.baseUrl = `${this.configService.get<string>('google.gcpBaseUrl')}/${this.bucketName}`;
        this.storage = new Storage({
            keyFilename: this.keyFilePath, // Path to your key file
        });
    }

    async uploadFile(filename: string,
                          content: IFile,
                          options?: any): Promise<any> {
        const bucket = this.storage.bucket(this.bucketName);
        const blob = bucket.file(content?.originalname);
        const blobStream = blob.createWriteStream();
        const mime: string = filename
            .substring(filename.lastIndexOf('.') + 1, filename.length)
            .toUpperCase();

        return new Promise((resolve, reject) => {
            blobStream.on('error', (err) => reject(err));
            blobStream.on('finish', () => {
                const publicUrl = `${this.baseUrl}/${blob.name}`;
                resolve({
                    path: `${blob.name}`,
                    pathWithFilename: `${blob.name}`,
                    filename: filename,
                    completedUrl: publicUrl,
                    baseUrl: this.baseUrl,
                    mime,
                }); // Resolve the public URL for the file
            });

            blobStream.end(content.buffer);
        });
    }
}