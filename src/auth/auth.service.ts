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
    private userService: UsersService
  ) {}
  async register(createUserInput: RegisterDto) {
    createUserInput.password = encrypt(createUserInput.password);
    try {
       const userGEt = await this.userRepository.findOne({
         email: createUserInput.email,
       });
       if (userGEt) {
         return {
           message: 'User already exist',
           success: false,
         };
       }  
      const user = await this.userService.create(createUserInput);
      const { id } = user;
      const payload = { id };
      const asscesstoken = this.jwtService.sign({ payload });
      return {
        token: asscesstoken,
      };
    } catch (error) {
      return error;
    }
  }
  async login(loginInput: LoginDto) {
    const user = await this.userRepository.findOne({
      email: loginInput.email,
    });
    if (user) {
      if (user.status) {
        if (decrypt(user.password) == loginInput.password) {
          const { id } = user;
          const payload = { id };
          const asscesstoken = this.jwtService.sign({ payload });
          return {
            token: asscesstoken,
          };
        } else {
          throw new UnauthorizedException('Enter Valid Password.');
        }
      } else {
         throw new BadRequestException('User is Not Active');
      }
      
    } else {
      throw new NotFoundException('User Not found');
    }
  }
  async changePassword(
    changePasswordInput: ChangePasswordDto,
    id: number,
  ){
    if (changePasswordInput.newPassword == changePasswordInput.oldPassword) {
      throw new BadRequestException('Please Enter Diffrent Password');
    }
    if (id) {
      const user = await this.userRepository.findOne({ id });
      if (user) {
        if (decrypt(user.password) == changePasswordInput.oldPassword) {
          const passwordnew = encrypt(changePasswordInput.newPassword);
          user.password = passwordnew;
          await this.userRepository.save(user);
          return {
            success: true,
            message: 'Password change successful',
          };
        } else {
          throw new UnauthorizedException('Enter Valid Old Password.');
        }
      } else {
        throw new NotFoundException('User Not found');
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
        success: true,
      };
    } else {
      return {
        success: false,
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
    return this.changePasswordCompareOTP(verifyForgetPasswordTokenInput, user);
  }
  async resetPassword(
    resetPasswordInput: ResetPasswordDto,
  ) {
    const user = await this.userRepository.findOne({
      email: resetPasswordInput.email,
    });
    if (user) {
      const passwordnew = encrypt(resetPasswordInput.password);
      user.password = passwordnew;
      await this.userRepository.save(user);
      return {
        success: true,
        message: 'Password change successful',
      };
    } else {
      throw new NotFoundException('User Not found');
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
      throw new NotFoundException('User Not Found');
    }
    const otp: number = this.generateOTP();
    const mailTrigger = new MailTrigger({
      name: user.profile.name,
      email: user.email,
      otp: otp,
    });
    const info: SMTPTransport.SentMessageInfo = await mailTrigger.sendMail();
    await this.setCache(user.email, otp);
    return this.changePasswordToken(email);
  }

  changePasswordToken(email: string) {
    const payload = {
      sub: email,
    };
    return { email: email, token: this.jwtService.sign({ payload }) };
  }

  async changePasswordCompareOTP(otpDto: VerifyForgetPasswordDto, user) {
    const { token } = otpDto;
    const cacheValue: any = await this.getCache(user.email);
    console.log(cacheValue);
    console.log(token);
    if (!cacheValue) {
      return {
        success: false,
        message: 'OTP Expired',
      };
    } else if (+cacheValue !== +token) {
      return {
        success: false,
        message: "OTP doesn't match.",
      };
    } else {
      return {
        success: true,
      };
    }
  }
}
