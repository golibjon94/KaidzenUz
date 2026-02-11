import { PartialType } from '@nestjs/swagger';
import { CreateSalesNetworkDto } from './create-sales-network.dto';

export class UpdateSalesNetworkDto extends PartialType(CreateSalesNetworkDto) {}
