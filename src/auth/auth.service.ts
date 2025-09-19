import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signOut(session: SessionContainer | undefined) {
    if (session) {
      await session.revokeSession();
    }
  }

  async signIn(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
