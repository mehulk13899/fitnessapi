import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined,  IsEmail,  isEmail,  IsNotEmpty, IsString } from 'class-validator';
import { ContactInfoEntity, ProfileEntity, UserSocialEntity } from '../entities/profile.entity';
import { InterestedIN } from '../entities/user.entity';

export class CreateUserDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  password: string;
  
  @ApiPropertyOptional()
  profile?: ProfileEntity;
  
  @ApiPropertyOptional()
  social?: UserSocialEntity;
  
  @ApiPropertyOptional()
  interested_in?: InterestedIN;
  
  @ApiPropertyOptional()
  contact_info?: ContactInfoEntity;
}
