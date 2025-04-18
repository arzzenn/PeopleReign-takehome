import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDefined, IsInt } from 'class-validator';
import PetDto from './pet.dto';

export default class PetListWithCounts {
  @Type(() => Number)
  @IsDefined()
  @IsInt()
  @ApiProperty({
    description: 'The total number of pets in the pet store',
    type: 'integer',
  })
  totalCount: number;

  @Type(() => Number)
  @IsDefined()
  @IsInt()
  @ApiProperty({
    description: 'The total number of pets in the pet store after any filtering has been applied',
    type: 'integer',
  })
  filteredCount: number;

  @IsDefined()
  @ApiProperty({
    type: PetDto,
    isArray: true,
  })
  data: Array<PetDto>;
}
