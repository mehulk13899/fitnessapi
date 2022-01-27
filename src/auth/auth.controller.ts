import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ChangePasswordDto,
  ForgetPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  VerifyForgetPasswordDto,
} from './dto/create-auth.dto';

@Controller()
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createAccount(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
  @Post('change-password')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  changePassword(@Body() changePasswordDto: ChangePasswordDto, @Req() req) {
    return this.authService.changePassword(
      changePasswordDto,
      req?.user?.payload?.id,
    );
  }
  @Get('aboutuser')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  me(@Req() req) {
    const id = req?.user?.payload?.id || 1;
    return this.authService.me(id);
  }
  @Post('forget-password-email-send')
  forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    return this.authService.forgetPassword(forgetPasswordDto);
  }
  @Post('verify-forget-password-otp')
  verifyForgetPassword(
    @Body() verifyForgetPasswordDto: VerifyForgetPasswordDto,
  ) {
    return this.authService.verifyForgetPasswordToken(verifyForgetPasswordDto);
  }
  // @Post('forget-password')
  // resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
  //   return this.authService.resetPassword(resetPasswordDto);
  // }
}
