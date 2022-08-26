import { PartialType } from '@nestjs/swagger';

import { CreateOrderReqDto } from './create-order.req.dto';

export class UpdateOrderDto extends PartialType(CreateOrderReqDto) {}
