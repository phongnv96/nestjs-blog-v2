import { UserEntity } from '../../../modules/user/repository/entities/user.entity';

export interface IMailService {
    sendUserConfirmation(user: UserEntity, token: string): Promise<any>;
}