import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateOrderReqDto } from './dto/create-order.req.dto';
import { GetOrdersReqDto } from './dto/get-orders.req.dto';
import { GetOrdersForAssetReqDto } from './dto/get-orders-for-asset.req.dto';
import { Order } from './entities/order.entity';
import { OrdersService } from './orders.service';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ operationId: 'createOrder' })
  @ApiResponse({ type: Order, status: 201 })
  @Post()
  createOrder(@Body() createOrderReqDto: CreateOrderReqDto): Promise<Order> {
    return this.ordersService.createOrder(createOrderReqDto);
  }

  @ApiOperation({ operationId: 'getOrder' })
  @ApiResponse({ type: Order, status: 200 })
  @Get(':id')
  getOrder(@Param('id') id: string): Promise<Order> {
    return this.ordersService.getOrder(id);
  }

  @ApiOperation({ operationId: 'getOrders' })
  @ApiResponse({ type: Order, isArray: true, status: 200 })
  @Get()
  getOrders(
    @Query() getOrdersReqDto: GetOrdersForAssetReqDto,
  ): Promise<Order[]> {
    return this.ordersService.getOrdersForAsset(getOrdersReqDto);
  }

  @ApiOperation({ operationId: 'cancelOffer' })
  @Put('cancel/:id')
  cancelOffer(@Param('id') id: string): Promise<Order> {
    return this.ordersService.cancelOffer(id);
  }

  @ApiOperation({ operationId: 'expireOffer' })
  @Put('expire/:id')
  expireOffer(@Param('id') id: string): Promise<Order> {
    return this.ordersService.expireOffer(id);
  }
}
