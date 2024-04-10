import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../../modules/user/repository/entities/user.entity';
import { IMailService } from '../interfaces/mail-service.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService implements IMailService {
    constructor(private mailerService: MailerService, private configService: ConfigService) {
    }

    async sendUserConfirmation(user: UserEntity, token: string) {
        const encodedToken = encodeURIComponent(token);
        const url = `${this.configService.get('client.loginSuccessUrl')}/${encodedToken}`;

        await this.mailerService.sendMail({
            to: user.email,
            // from: '"Support Team" <support@example.com>', // override default from
            subject: 'Welcome to DevCo blog! Confirm your Email',
            template: './confirmation', // `.hbs` extension is appended automatically
            context: { // ✏️ filling curly brackets with content
                name: user.firstName,
                url,
            },
        });
    }
}
