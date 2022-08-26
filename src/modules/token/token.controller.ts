import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateTokenMetadataReqDto } from './dto/create-token-metadata.req.dto';
import { TokenService } from './token.service';

@ApiTags('token')
@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @ApiOperation({ operationId: 'createTokenMetadata' })
  @ApiResponse({ status: 201 })
  @Post('metadata')
  async createTokenMetadata(
    @Body() createTokenMetadataReqDto: CreateTokenMetadataReqDto,
  ): Promise<string> {
    const { path } = await this.tokenService.createTokenMetadata(
      createTokenMetadataReqDto,
    );
    return path;
  }

  @ApiOperation({ operationId: 'getTokenMetadata' })
  @ApiResponse({ status: 200 })
  @Get('metadata/:path')
  async getTokenMetadata(@Param('path') path: string): Promise<string> {
    return this.tokenService.getTokenMetadata(path);
  }
}
