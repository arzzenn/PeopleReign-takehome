// quick and dirty types to allow axios get responses to be typed
export enum PetTypes {
  BIRD = 'Bird',
  CAT = 'Cat',
  DOG = 'Dog',
  REPTILE = 'Reptile',
}

export class PetDto {
  id: string;
  name: string;
  age: number;
  cost: number;
  type: PetTypes;
  createdAt: String;
  updatedAt: String;
}

export class PetListWithCountsDto {
  totalCount: number;
  filteredCount: number;
  data: Array<PetDto>;
}
