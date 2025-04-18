import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDefined, IsEnum, IsInt } from 'class-validator';
import { PetTypes } from '../schemas/pet.schema';

export default class CreatePetDto {
  @IsDefined()
  @ApiProperty({
    description: 'The name of this pet.',
    type: String,
  })
  readonly name: string;

  @Type(() => Number)
  @IsDefined()
  @IsInt()
  @ApiProperty({
    description: 'The age in years this pet is.',
  })
  readonly age: number;

  @Type(() => Number)
  @IsDefined()
  @IsInt()
  @ApiProperty({
    description: 'Cost in USD pennies. $4.50 would be represented here as 450.',
  })
  readonly cost: number;

  @IsDefined()
  @IsEnum(PetTypes)
  @ApiProperty({ description: 'The type of pet this is.' })
  readonly type: PetTypes;
}
