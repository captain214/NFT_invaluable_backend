import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateRawEventDto } from './dto/create-raw-event.dto';
import { UpdateRawEventDto } from './dto/update-raw-event.dto';
import { RawEventsService } from './raw-events.service';

@ApiTags('raw-events')
@Controller('raw-events')
export class RawEventsController {
  constructor(private readonly rawEventsService: RawEventsService) {}

  // @ApiOperation({ operationId: 'getStartBlock' })
  // @ApiResponse({ type: Number, status: 200 })
  // @Get()
  // getStartBlock(): Promise<number> {
  //   return this.rawEventsService.getStartBlock('local');
  // }
}
