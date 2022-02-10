import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { UserT } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import {
  ProfileSchema,
  UserSocialSchema,
  ContactInfoSchema,
} from './entities/profile.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserT) private userRepository: Repository<UserT>,
  ) {}
  profileRepositry = getRepository(ProfileSchema);
  userSocialRepositry = getRepository(UserSocialSchema);
  contactInfoRepositry = getRepository(ContactInfoSchema);

  async create(createUserDto: CreateUserDto) {
    const user = new UserT();
    user.email = createUserDto.email;
    user.password = createUserDto.password;
    user.status = true;
    user.interested_in = createUserDto.interested_in;
    await this.userRepository.save(user).catch((err) => {
      console.log(err);
      return err;
    });
    if (createUserDto?.social) {
      const user_social = new UserSocialSchema();
      user_social.user = user;
      user_social.facebook_link = createUserDto.social.facebook_link;
      user_social.twitter_link = createUserDto.social.twitter_link;
      user_social.instagram_link = createUserDto.social.instagram_link;
      user_social.linkedin_link = createUserDto.social.linkedin_link;
      await this.userSocialRepositry.save(user_social).catch((err) => {
      console.log(err);
      return err;
    });;
    }
    if (createUserDto?.contact_info) {
      const contact_info = new ContactInfoSchema();
      contact_info.user = user;
      contact_info.country = createUserDto.contact_info.country;
      contact_info.code = createUserDto.contact_info.code;
      contact_info.country = createUserDto.contact_info.country;
      contact_info.mobile_number = createUserDto.contact_info.mobile_number;
      await this.contactInfoRepositry.save(contact_info).catch((err) => {
      console.log(err);
      return err;
    });;
    }

    if (createUserDto?.profile) {
      const profile = new ProfileSchema();
      profile.user = user;
      profile.fat_percentage = createUserDto?.profile?.fat_percentage;
      profile.fitness_level = createUserDto?.profile?.fitness_level;
      profile.food_preference = createUserDto?.profile?.food_preference;
      profile.name = createUserDto?.profile?.name;
      profile.bio = createUserDto?.profile?.bio;
      profile.height = createUserDto?.profile?.height;
      profile.weight = createUserDto?.profile?.weight;
      profile.photo = createUserDto?.profile?.photo;
      profile.gender = createUserDto?.profile?.gender;
      profile.target_weight = createUserDto?.profile?.target_weight;
      profile.date_of_birth = createUserDto?.profile?.date_of_birth;
      await this.profileRepositry.save(profile).catch((err) => {
      console.log(err);
      return err;
    });;
    }
    return user;
  }

  getUsers() {
    return this.userRepository.find();
  }
  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne(id);
    user.loginfrom = updateUserDto?.loginfrom;
    if (user['profile'] == undefined || user['profile'] == null) {
      if (updateUserDto?.profile) {
        const profile = await this.profileRepositry.save({
          ...updateUserDto.profile,
        });
        await this.userRepository.update(id, { profile });
      }
    } else {
      if (updateUserDto?.profile) {
        await this.profileRepositry.update(
          { id: user.profile.id },
          {
            ...updateUserDto.profile,
          },
        );
      }
    }
    if (user['contact_info'] == undefined || user['contact_info'] == null) {
      if (updateUserDto?.contact_info) {
        const contact_info = await this.contactInfoRepositry.save({
          ...updateUserDto.contact_info,
        });
        await this.userRepository.update(id, { contact_info });
      }
    } else {
      if (updateUserDto?.contact_info) {
        await this.contactInfoRepositry.update(
          { id: user.contact_info.id },
          {
            ...updateUserDto.contact_info,
          },
        );
      }
    }
    if (user['social'] == undefined || user['social'] == null) {
      if (updateUserDto?.social) {
        const social = await this.userSocialRepositry.save({
          ...updateUserDto.social,
        });
        await this.userRepository.update(id, { social });
      }
    } else {
      if (updateUserDto?.social) {
        await this.userSocialRepositry.update(
          { id: user.social.id },
          {
            ...updateUserDto.social,
          },
        );
      }
    }
    return await this.userRepository.findOne(id);
  }
  async remove(id: number) {
    const user = await this.userRepository.findOne(id);
    if (user) {
      await this.userRepository.remove(user);
      return {
        statusCode: 200,
        message: 'User deleted',
      };
    } else {
      throw new BadRequestException({
        statusCode: 400,
        message: 'User not found',
      }).getResponse();
    }
  }
  async activeUser(id: number) {
    const user = await this.userRepository.findOne(id);
    if (user) {
      await this.userRepository.update(id, { status: true });
      return {
        statusCode: 200,
        message: 'User activated',
      };
    } else {
      throw new BadRequestException({
        statusCode: 400,
        message: 'User not found',
      }).getResponse();
    }
  }
  async deactiveUser(id: number) {
    const user = await this.userRepository.findOne(id);
    if (user) {
      await this.userRepository.update(id, { status: false });
      return {
        statusCode: 200,
        message: 'User deactivated',
      };
    } else {
      throw new BadRequestException({
        statusCode: 400,
        message: 'User not found',
      }).getResponse();
    }
  }
  async findOne(id: number) {
    const user = await this.userRepository.findOne(id);
    if (user) {
      return {
        statusCode: 200,
        message: 'User found',
        user,
      };
    } else {
      throw new BadRequestException({
        statusCode: 400,
        message: 'User not found',
        user: '',
      }).getResponse();
    }
  }
}
