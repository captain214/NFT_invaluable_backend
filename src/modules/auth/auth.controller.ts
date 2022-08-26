import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    public readonly userService: UserService,
    public readonly authService: AuthService,
  ) {}

  @Get(':address')
  @HttpCode(HttpStatus.OK)
  getAuthUser(@Param('address') address: string): Promise<string> {
    return this.authService.authUser(address);
  }
}
