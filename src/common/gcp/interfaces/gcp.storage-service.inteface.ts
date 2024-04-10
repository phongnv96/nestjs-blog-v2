export interface IGCPStorageService {
    uploadFile(filename: string,
               content: Express.Multer.File,
               options?: any): Promise<any>
}