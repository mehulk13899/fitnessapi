import { CreateUserDto } from "src/users/dto/create-user.dto";

export class RegisterDto extends CreateUserDto {}

export class LoginDto {
  email: string;
  password?: string;
  loginfrom?: string;
}

export class ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}
export class ForgetPasswordDto {
  email: string;
}
export class VerifyForgetPasswordDto {
  email: string;
  otp: string;
  password: string;
}
export class ResetPasswordDto {
  email: string;
  password: string;
}

export class AuthResponse {
  token: string;
  permissions: string[];
}

export class EmailOtpDto {
  otp: string;
}
