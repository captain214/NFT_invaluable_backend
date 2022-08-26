import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiFile } from '../../decorators/swagger.schema';
import { MetaAuthGuard } from '../../guards/meta-auth.guard';
import { IFile } from '../../interfaces';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':address')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get user profile',
    type: User,
  })
  getUserByAddress(@Param('address') address: string): Promise<User> {
    return this.userService.getUserByAddress(address);
  }

  @Post(':address/avatar')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: User, description: 'Avatar Successfully Edited' })
  @ApiFile({ name: 'avatar' })
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(MetaAuthGuard)
  async setAvatar(
    @Param('address') address: string,
    @UploadedFile() file: IFile,
  ): Promise<User> {
    return this.userService.setAvatar(address, file);
  }

  @Post(':address/banner')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: User, description: 'Banner Successfully Edited' })
  @ApiFile({ name: 'banner' })
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(MetaAuthGuard)
  async setBanner(
    @Param('address') address: string,
    @UploadedFile() file: IFile,
  ): Promise<User> {
    return this.userService.setBanner(address, file);
  }

  @Post(':address/name')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: User, description: 'Name Successfully Edited' })
  @UseGuards(MetaAuthGuard)
  async setName(
    @Param('address') address: string,
    @Body() body: { name: string },
  ): Promise<User> {
    return this.userService.setName(address, body.name);
  }
}
