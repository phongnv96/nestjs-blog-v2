import { Module } from '@nestjs/common';
import { GCPStorageService } from './services/gcp.storage.service';
import { GoogleAuthService } from './services/gcp.oauth2.service';

@Module({
    exports: [GCPStorageService, GoogleAuthService],
    providers: [GCPStorageService, GoogleAuthService],
    imports: [],
    controllers: [],
})
export class GCPModule {
}