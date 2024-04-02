import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Token } from './interfaces/token.interface';
import { UserLogin } from './interfaces/user.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  private logger = new Logger('Auth');
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async login(user: UserLogin | undefined): Promise<Token> {
    if (user === undefined) {
      throw new InternalServerErrorException(
        `The user information isn't being passed from Google, is it? ${user}`,
      );
    }
    this.logger.log('This is the user information provided by Google.', user);

    const userExists = await this.findUserByEmail(user.email);
    if (!userExists) {
      return this.registerUser(user);
    }
    return await this.getTokens(user.id, user.email);
  }

  async registerUser(user: UserLogin) {
    try {
      const newUser = this.userRepository.create({
        id: user.id,
        email: user.email,
        displayName: user.firstName,
      });
      await this.userRepository.save(newUser);
      return await this.getTokens(user.id, user.email);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }

    return user;
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
