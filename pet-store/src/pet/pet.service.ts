import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import CreatePetDto from './dtos/create-pet.dto';
import PetListWithCounts from './dtos/pet-list.dto';
import PetDto from './dtos/pet.dto';
import UpdatePetDto from './dtos/update-pet.dto';
import { Pet } from './schemas/pet.schema';

// DO NOT EDIT THIS VALUE, yes it could be larger or smaller, but it's here to force certain conditions
const MAX_LIMIT = 100;

export type PetQueryFilter = {
  gt: string;
  gte: string;
  lt: string;
  lte: string;
  eq: string;
};

@Injectable()
export class PetService {
  constructor(@InjectModel(Pet.name) private petModel: Model<Pet>) {}

  /*
    Helper function to convert passed query into mongoose filter object
  */
  private parseFilterStringToFilterQuery(filter: PetQueryFilter): { $eq?: any; $gt?: any; $lt?: any; $gte?: any; $lte?: any } {
    const allowedOperators = ['eq', 'gt', 'lt', 'gte', 'lte'];
    const filterObj = {};
    if (!filter) {
      return filterObj;
    }
    allowedOperators.forEach((operator) => {
      if (filter[operator] !== undefined) {
        if (!isNaN(Number(filter[operator]))) {
          filterObj['$' + operator] = Number(filter[operator]);
        } else {
          filterObj['$' + operator] = filter[operator];
        }
      }
    });
    return filterObj;
  }

  async list(
    filter: { age: PetQueryFilter; cost: PetQueryFilter; type: PetQueryFilter; name: PetQueryFilter },
    offset: number,
    limit: number,
    sort: string,
  ): Promise<PetListWithCounts> {
    if (limit == undefined || limit < 1) {
      limit = MAX_LIMIT;
    }
    limit = Math.min(limit, MAX_LIMIT);

    const findFilter: FilterQuery<Pet> = {};

    // apply age filter to find filter
    const ageFilter = this.parseFilterStringToFilterQuery(filter.age);
    if (Object.keys(ageFilter).length > 0) {
      findFilter.age = ageFilter;
    }

    // apply cost filter to find filter
    const costFilter = this.parseFilterStringToFilterQuery(filter.cost);
    if (Object.keys(costFilter).length > 0) {
      findFilter.cost = costFilter;
    }

    // apply type filter to find filter
    const typeFilter = this.parseFilterStringToFilterQuery(filter.type);
    if (Object.keys(typeFilter).length > 0) {
      findFilter.type = typeFilter;
    }

    // apply name filter to find filter
    const nameFilter = this.parseFilterStringToFilterQuery(filter.name);
    if (Object.keys(nameFilter).length > 0) {
      findFilter.name = nameFilter;
    }

    // when executed, this query should represent the total number of documents in the collection
    const totalCountQuery = this.petModel.countDocuments();

    // when executed, this query should represent the total number of documents that match the passed filter
    const filteredCountQuery = this.petModel.countDocuments(findFilter);

    // when executed, this query should return documents that match the passed filter while respecting the offset and limit (pagination)
    const findQuery = this.petModel.find(findFilter);

    // apply offset
    findQuery.skip(offset || 0);

    // apply limit
    findQuery.limit(limit);

    if (sort) {
      const direction = sort.charAt(0) === '-' ? -1 : 1;
      const field = sort.substring(1);
      
      // Explicitly don't allow sorting on date fields
      if (field === 'createdAt' || field === 'updatedAt') {
        // Do nothing - don't apply sort
        //suffled later to break any order
      } else {
        // Only allow sorting on these fields
        const allowedSortFields = ['cost', 'age', 'name', 'type'];
        if (allowedSortFields.includes(field)) {
          const sortObj = {};
          sortObj[field] = direction;
          findQuery.sort(sortObj);
        }
      }
    }

    // execute the queries and then return the counts and data
    return Promise.all([totalCountQuery.exec(), filteredCountQuery.exec(), findQuery.exec()]).then((results) => {
      let data = results[2].map((entity) => entity.toDto());
      
      // If sorting by updatedAt or createdAt was requested, shuffle the results to break any order
      if (sort && (sort.substring(1) === 'updatedAt' || sort.substring(1) === 'createdAt')) {
        // Fisher-Yates algorithm
        for (let i = data.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [data[i], data[j]] = [data[j], data[i]];
        }
      }
      
      return {
        totalCount: results[0],
        filteredCount: results[1],
        data: data,
      };
    });
  }

  async create(createPetDto: CreatePetDto): Promise<PetDto> {
    return this.petModel.create(createPetDto).then((pet) => {
      // Convert it into a DTO so we don't return the db entity
      return pet.toDto();
    });
  }

  async update(petId: string, updatePetDto: UpdatePetDto): Promise<PetDto> {
    return this.petModel.findByIdAndUpdate(petId, updatePetDto, { new: true }).then((pet) => {
      if (!pet) {
        throw new NotFoundException();
      }
      // Convert it into a DTO so we don't return the db entity
      return pet.toDto();
    });
  }

  async delete(petId: string) {
    return this.petModel.findByIdAndDelete(petId).then((pet) => {
      return pet ? pet.toDto() : null;
    });
  }
}
