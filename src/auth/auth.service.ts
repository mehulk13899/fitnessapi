import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { EmailDto } from './dto/email.dto';
import { Cache } from 'cache-manager';
import { MailTrigger } from './mail-service/mail-trigger';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import {
  ChangePasswordDto,
  ForgetPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  VerifyForgetPasswordDto,
} from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UserT } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { decrypt, encrypt } from 'src/common/cryproencdes';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserT) private userRepository: Repository<UserT>,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private userService: UsersService,
  ) {}
  async register(createUserInput: RegisterDto) {
    if (createUserInput?.password)
      createUserInput.password = encrypt(createUserInput.password);
    try {
      const userGEt = await this.userRepository.findOne({
        email: createUserInput.email,
      });
      if (userGEt) {
        throw new BadRequestException({
          statusCode: 400,
          message: 'User already exist',
          token: '',
          user: '',
        }).getResponse();
      }
      const user = await this.userService.create(createUserInput);
      const { id } = user;
      const payload = { id };
      const asscesstoken = this.jwtService.sign({ payload });
      return {
        statusCode: 200,
        token: asscesstoken,
        message: 'User Created successfully',
        user,
      };
    } catch (error) {
      return error;
    }
  }
  async login(loginInput: LoginDto) {
    if (loginInput?.loginfrom == undefined) {
      throw new BadRequestException("Please provide loginfrom").getResponse();
    }
    const user = await this.userRepository.findOne({
      email: loginInput.email,
    });
    if (user) {

      const { id } = user;
      const payload = { id };
      const asscesstoken = this.jwtService.sign({ payload });

      if (user.status) {
        if (loginInput?.loginfrom == 'email') {
          if (decrypt(user.password) == loginInput.password) {
            return {
              statusCode: 200,
              message: 'Login Successfully',
              token: asscesstoken,
              user,
            };
          } else {
            throw new UnauthorizedException({
              statusCode: 401,
              message: 'Enter Valid Password.',
              token: '',
              user: '',
            }).getResponse();
          }
        }
        else
        { 
           return {
             statusCode: 200,
             message: 'Login Successfully',
             token: asscesstoken,
             user,
           };
          }
      } else {
        throw new BadRequestException({
          statusCode: 401,
          message: 'User is not active.',
          token: '',
          user: '',
        }).getResponse();
      }
    } else {
      throw new NotFoundException({
        statusCode: 404,
        message: 'User Not found.',
        token: '',
        user: '',
      }).getResponse();
    }
  }
  async changePassword(changePasswordInput: ChangePasswordDto, id: number) {
    if (changePasswordInput.newPassword == changePasswordInput.oldPassword) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Please Enter Diffrent Password',
      }).getResponse();
    }
    if (id) {
      const user = await this.userRepository.findOne({ id });
      if (user) {
        if (decrypt(user.password) == changePasswordInput.oldPassword) {
          const passwordnew = encrypt(changePasswordInput.newPassword);
          user.password = passwordnew;
          await this.userRepository.save(user);
          return {
            statusCode: 200,
            message: 'Password change successful',
          };
        } else {
          throw new UnauthorizedException({
            statusCode: 401,
            message: 'Enter Valid Old Password.',
          }).getResponse();
        }
      } else {
        throw new NotFoundException({
          statusCode: 404,
          message: 'User Not found',
        }).getResponse();
      }
    }
  }
  async forgetPassword(forgetPasswordInput: ForgetPasswordDto) {
    const user = await this.userRepository.findOne({
      email: forgetPasswordInput.email,
    });
    if (user) {
      await this.changePasswordGenerateOTP(forgetPasswordInput); //send email
      return {
        statusCode: 200,
        message: 'Mail Send Successfully',
      };
    } else {
      return {
        statusCode: 404,
        message: 'User not found',
      };
    }
  }
  async verifyForgetPasswordToken(
    verifyForgetPasswordTokenInput: VerifyForgetPasswordDto,
  ) {
    const user = await this.userRepository.findOne({
      email: verifyForgetPasswordTokenInput.email,
    });
    if (user) {
      return this.changePasswordCompareOTP(
        verifyForgetPasswordTokenInput,
        user,
      );
    } else {
      return {
        statusCode: 404,
        message: 'User not found',
      };
    }
  }
  async resetPassword(resetPasswordInput: ResetPasswordDto) {
    const user = await this.userRepository.findOne({
      email: resetPasswordInput.email,
    });
    if (user) {
      const passwordnew = encrypt(resetPasswordInput.password);
      user.password = passwordnew;
      await this.userRepository.save(user);
      return {
        statusCode: 200,
        message: 'Password change successful',
      };
    } else {
      throw new NotFoundException({
        statusCode: 404,
        message: 'User not found',
      }).getResponse();
    }
  }

  async me(id: number): Promise<UserT> {
    const user = await this.userRepository.findOne({ id });
    return user;
  }

  private async getCache(id: string): Promise<any> {
    return this.cacheManager.get(id);
  }

  private async setCache(id: string, value: any): Promise<void> {
    await this.cacheManager.set(id, value, { ttl: 300 });
  }

  private generateOTP(): number {
    return Math.floor(Math.random() * 1000000);
  }
  async changePasswordGenerateOTP(forgetPasswordInput: ForgetPasswordDto) {
    const { email } = forgetPasswordInput;
    const user = await this.userRepository.findOne({
      email: email,
    });
    if (!user) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'User not found',
      }).getResponse();
    }
    const otp: number = this.generateOTP();
    const mailTrigger = new MailTrigger({
      name: user?.profile?.name ? user?.profile?.name : "User" ,
      email: user.email,
      otp: otp,
    });
    const info: SMTPTransport.SentMessageInfo = await mailTrigger.sendMail();
    await this.setCache(user.email, otp);
  }
  async changePasswordCompareOTP(otpDto: VerifyForgetPasswordDto, user) {
    const { otp } = otpDto;
    const cacheValue: any = await this.getCache(user.email);
    console.log(cacheValue);
    if (!cacheValue) {
      throw new NotFoundException({
        statusCode: 400,
        message: 'OTP Expired',
      }).getResponse();
    } else if (+cacheValue !== +otp) {
      throw new NotFoundException({
        statusCode: 400,
        message: "OTP doesn't match.",
      }).getResponse();
    } else {
      if (user) {
        const passwordnew = encrypt(otpDto.password);
        user.password = passwordnew;
        await this.userRepository.save(user);
        return {
          statusCode: 200,
          message: 'Password change successful',
        };
      } else {
        throw new NotFoundException({
          statusCode: 404,
          message: 'User not found',
        }).getResponse();
      }
    }
  }
}
