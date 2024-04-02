import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Token } from './interfaces/token.interface';
import { User } from './interfaces/user.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(user: User | undefined): Promise<Token> {
    if (user === undefined) {
      throw new InternalServerErrorException(
        `The user information isn't being passed from Google, is it? ${user}`,
      );
    }
    console.log('This is the user information provided by Google.', user);

    const { accessToken, refreshToken } = await this.getTokens(
      user.id,
      user.email,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async getTokens(userId: string, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('jwt.accessSecret'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('jwt.refreshSecret'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(userId: string, username: string, refreshToken: string) {
    // If you want to do it properly, compare the hashed refreshToken stored in the database with the hashed refreshToken provided by the user,
    //and throw an exception if they do not match. Since this is just a sample, whenever refreshTokens is called, return a new accessToken.
    const tokens = await this.getTokens(userId, username);
    return tokens;
  }
}
