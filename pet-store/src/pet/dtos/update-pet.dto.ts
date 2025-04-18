import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { PetTypes } from '../schemas/pet.schema';

export default class UpdatePetDto {
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'The name of this pet.',
    type: String,
  })
  readonly name?: string;

  @IsOptional()
  @IsInt()
  @ApiProperty({
    required: false,
    description: 'The age in years this pet is.',
  })
  readonly age?: number;

  @IsOptional()
  @IsInt()
  @ApiProperty({
    required: false,
    description: 'Cost in USD pennies. $4.50 would be represented here as 450.',
  })
  readonly cost?: number;

  @IsOptional()
  @IsEnum(PetTypes)
  @ApiProperty({
    required: false,
    description: 'The type of pet this is.',
  })
  readonly type?: PetTypes;
}
