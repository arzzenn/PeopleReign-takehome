import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import CreatePetDto from './dtos/create-pet.dto';
import PetListWithCounts from './dtos/pet-list.dto';
import PetDto from './dtos/pet.dto';
import UpdatePetDto from './dtos/update-pet.dto';
import { PetQueryFilter, PetService } from './pet.service';

@Controller('/api/v1/pet')
@UsePipes(ValidationPipe)
export class PetController {
  constructor(private readonly petService: PetService) {}

  @Get('')
  @ApiOperation({ description: 'Returns an optionally filtered and sorted list of paginated pets' })
  @HttpCode(HttpStatus.OK)
  list(
    @Query('age') age: PetQueryFilter,
    @Query('cost') cost: PetQueryFilter,
    @Query('type') type: PetQueryFilter,
    @Query('name') name: PetQueryFilter,
    @Query('offset', new ParseIntPipe({ optional: true })) offset: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number,
    @Query('sort') sort: string,
  ): Promise<PetListWithCounts> {
    return this.petService.list({ age, cost, type, name }, offset, limit, sort);
  }

  @Post()
  @ApiOperation({ description: 'Create a new Pet' })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPetDto: CreatePetDto): Promise<PetDto> {
    return this.petService.create(createPetDto);
  }

  @Patch('/:id')
  @ApiOperation({ description: 'Updates a pet by id' })
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updatePetDto: UpdatePetDto): Promise<PetDto> {
    return this.petService.update(id, updatePetDto);
  }

  @Delete('/:id')
  @ApiOperation({ description: 'Delete a pet by id' })
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.petService.delete(id);
  }
}
