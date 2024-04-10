import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './services/mail.service';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GCPModule } from '../gcp/gcp.module';

@Module({
    imports: [
        GCPModule,
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                transport: {
                    service: 'gmail',
                    port: 465,
                    secure: true,
                    auth: {
                        type: 'OAuth2',
                        user: configService.get('mail.mailUser'),
                        clientId: configService.get('mail.clientId'),
                        clientSecret: configService.get('mail.clientSecret'),
                        refreshToken: '1//046bLb_hPNSvTCgYIARAAGAQSNwF-L9IrknTV95KCeS5THdJBXMhxwG86cTgXd7Ezs8y494w9Qn5gcwbD952ELCv1Sp7L8piO2dE',
                    },
                },
                defaults: {
                    from: '"No Reply" <devcoblog@gmail.com>',
                },
                template: {
                    dir: join(__dirname, 'templates'),
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true,
                    },
                },
            }),
        }),
    ],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule {
}
