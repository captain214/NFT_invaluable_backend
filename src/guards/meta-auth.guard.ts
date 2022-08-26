import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';

import { AuthService } from '../modules/auth/auth.service';

@Injectable()
export class MetaAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const { headers } = context.switchToHttp().getRequest();
    return this.authService.checkUser(headers.signature, headers.address);
  }
}
