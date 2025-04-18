import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDefined, IsEnum, IsInt } from 'class-validator';
import { PetTypes } from '../schemas/pet.schema';

export default class PetDto {
  @IsDefined()
  @ApiProperty({
    description: 'The unique identifier of this pet',
    type: String,
  })
  id: string;

  @Type(() => String)
  @IsDefined()
  @IsInt()
  @ApiProperty({
    description: 'The name of this pet.',
    type: 'string',
  })
  name: string;

  @Type(() => Number)
  @IsDefined()
  @IsInt()
  @ApiProperty({
    description: 'The age in years this pet is.',
    type: 'integer',
  })
  age: number;

  @Type(() => Number)
  @IsDefined()
  @IsInt()
  @ApiProperty({
    description: 'Cost in USD pennies. $4.50 would be represented here as 450.',
    type: 'integer',
  })
  cost: number;

  @IsDefined()
  @IsEnum({
    enum: PetTypes,
    enumName: 'PetTypes',
  })
  @ApiProperty({
    description: 'The type of pet this is.',
    type: 'enum',
  })
  type: PetTypes;

  @ApiProperty({
    description: 'When this pet was added to the pet store',
    type: Date,
  })
  createdAt: String;

  @ApiProperty({
    description: 'When this pet was last modified in the pet store',
    type: Date,
  })
  updatedAt: String;
}
