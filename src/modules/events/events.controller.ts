import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateEventReqDto } from './dto/create-event.req.dto';
import { GetEventsReqDto } from './dto/get-events.req.dto';
import { EventLog } from './entities/event.entity';
import { EventsService } from './events.service';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @ApiOperation({ operationId: 'createEvent' })
  @ApiResponse({ type: EventLog, status: 201 })
  @Post()
  createEvent(@Body() createEventReqDto: CreateEventReqDto): Promise<EventLog> {
    return this.eventsService.createEvent(createEventReqDto);
  }

  @ApiOperation({ operationId: 'getEvent' })
  @ApiResponse({ type: EventLog, status: 200 })
  @Get(':id')
  getOrder(@Param('id') id: string): Promise<EventLog> {
    return this.eventsService.getEvent(id);
  }

  @ApiOperation({ operationId: 'getEvents' })
  @ApiResponse({ type: EventLog, isArray: true, status: 200 })
  @Get()
  getOrders(@Query() dto: GetEventsReqDto): Promise<EventLog[]> {
    return this.eventsService.getEvents(dto);
  }
}
