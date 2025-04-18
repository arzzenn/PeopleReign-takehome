import { HttpStatus, INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Types as MongooseTypes } from 'mongoose';
import * as request from 'supertest';
import { appModuleMetadata } from '../app.module';
import CreatePetDto from './dtos/create-pet.dto';
import PetDto from './dtos/pet.dto';
import PetTestHelper from './helpers/pet.testhelper';
import { Pet, PetTypes } from './schemas/pet.schema';

const wait = (milliseconds: number) => {
  return new Promise(resolve => {
      setTimeout(resolve, milliseconds);
  });
}

const isAscending = (arr, key) => {
  return arr.every(function (x, i) {
      return i === 0 || x[key] >= arr[i - 1][key];
  });
}

const isDescending = (arr, key) => {
  return arr.every(function (x, i) {
      return i === 0 || x[key] <= arr[i - 1][key];
  });
}

describe('Pet API', () => {
  let app: INestApplication;
  let helper: PetTestHelper;
  let model: Model<Pet>;

  // This runs only once before all tests to set up the application under test including things like the connection to the database
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule(appModuleMetadata).compile();

    model = module.get<Model<Pet>>(getModelToken('Pet'));
    helper = new PetTestHelper(model);

    app = module.createNestApplication();
    await app.init();
  });

  // This runs only once after all tests - cleans up open handles, etc.
  afterAll(async () => {
    await model.db.close();
    await app.close();
  });

  // This runs once before each test
  beforeEach(async () => {
    // delete everything before each test so each test starts from a clean slate
    await model.deleteMany();
  });

  // This runs once after each test
  afterEach(async () => {
    // delete any watched entities so that the test exits in a clean state
    await helper.deleteWatched();
  });

  it('should GET an array of Pets with a specified limit', async () => {
    const pets = [];
    for (let i = 0; i < 20; i += 1) {
      pets.push(helper.randomPet());
    }
    await Promise.all(pets);
    return request(app.getHttpServer())
      .get(`/api/v1/pet?limit=10`)
      .expect(HttpStatus.OK)
      .then((res) => {
        expect(res.body.totalCount).toEqual(pets.length);
        expect(res.body.filteredCount).toEqual(pets.length);
        expect(res.body.data.length).toEqual(10);
      });
  });

  it('should GET an array of Pets no larger than 100 when asked for less than 0', async () => {
    // create a list of pets
    const pets = [];
    for (let i = 0; i < 125; i += 1) {
      pets.push(helper.randomPet());
    }
    await Promise.all(pets);

    return request(app.getHttpServer())
      .get(`/api/v1/pet?limit=-1`)
      .expect(HttpStatus.OK)
      .then((res) => {
        expect(res.body.totalCount).toEqual(pets.length);
        expect(res.body.filteredCount).toEqual(pets.length);
        expect(res.body.data.length).toEqual(100);
      });
  });

  it('should GET an array of Pets no larger than 100 when asked for 0', async () => {
    // create a list of pets
    const pets = [];
    for (let i = 0; i < 125; i += 1) {
      pets.push(helper.randomPet());
    }
    await Promise.all(pets);

    return request(app.getHttpServer())
      .get(`/api/v1/pet?limit=0`)
      .expect(HttpStatus.OK)
      .then((res) => {
        expect(res.body.totalCount).toEqual(pets.length);
        expect(res.body.filteredCount).toEqual(pets.length);
        expect(res.body.data.length).toEqual(100);
      });
  });

  it('should GET an array of Pets no larger than 100 when asked for more than 100', async () => {
    // create a list of pets
    const pets = [];
    for (let i = 0; i < 125; i += 1) {
      pets.push(helper.randomPet());
    }
    await Promise.all(pets);

    return request(app.getHttpServer())
      .get(`/api/v1/pet?limit=101`)
      .expect(HttpStatus.OK)
      .then((res) => {
        expect(res.body.totalCount).toEqual(pets.length);
        expect(res.body.filteredCount).toEqual(pets.length);
        expect(res.body.data.length).toEqual(100);
      });
  });

  it('should GET an array of Pets between age 5 and 10', async () => {
    // create a list of pets
    await Promise.all([
      helper.randomPet({ age: 1 }),
      helper.randomPet({ age: 2 }),
      helper.randomPet({ age: 3 }),
      helper.randomPet({ age: 4 }),
      helper.randomPet({ age: 4 }),
      helper.randomPet({ age: 5 }),
      helper.randomPet({ age: 6 }),
      helper.randomPet({ age: 6 }),
      helper.randomPet({ age: 6 }),
      helper.randomPet({ age: 7 }),
      helper.randomPet({ age: 7 }),
      helper.randomPet({ age: 8 }),
      helper.randomPet({ age: 8 }),
      helper.randomPet({ age: 8 }),
      helper.randomPet({ age: 11 }),
      helper.randomPet({ age: 24 }),
    ]);

    // query them via API
    return request(app.getHttpServer())
      .get(`/api/v1/pet?age[gt]=5&age[lt]=10`)
      .expect(HttpStatus.OK)
      .then((res) => {
        expect(res.body.totalCount).toEqual(16);
        expect(res.body.filteredCount).toEqual(8);
        expect(res.body.data.length).toEqual(8);
        res.body.data.forEach((pet: PetDto) => {
          expect(pet.age).toBeGreaterThan(5);
          expect(pet.age).toBeLessThan(10);
        });
      });
  });

  it('should GET an array of Pets greater than or equal to age 5', async () => {
    // create a list of pets
    await Promise.all([
      helper.randomPet({ age: 1 }),
      helper.randomPet({ age: 2 }),
      helper.randomPet({ age: 3 }),
      helper.randomPet({ age: 4 }),
      helper.randomPet({ age: 4 }),
      helper.randomPet({ age: 5 }),
      helper.randomPet({ age: 6 }),
      helper.randomPet({ age: 6 }),
      helper.randomPet({ age: 6 }),
      helper.randomPet({ age: 7 }),
      helper.randomPet({ age: 7 }),
      helper.randomPet({ age: 8 }),
      helper.randomPet({ age: 8 }),
      helper.randomPet({ age: 8 }),
      helper.randomPet({ age: 11 }),
      helper.randomPet({ age: 24 }),
    ]);

    // query them via API
    return request(app.getHttpServer())
      .get(`/api/v1/pet?age[gte]=5`)
      .expect(HttpStatus.OK)
      .then((res) => {
        expect(res.body.totalCount).toEqual(16);
        expect(res.body.filteredCount).toEqual(11);
        expect(res.body.data.length).toEqual(11);
        res.body.data.forEach((pet: PetDto) => {
          expect(pet.age).toBeGreaterThanOrEqual(5);
        });
      });
  });

  it('should GET an array of Pets less than or equal to age 7', async () => {
    // create a list of pets
    await Promise.all([
      helper.randomPet({ age: 1 }),
      helper.randomPet({ age: 2 }),
      helper.randomPet({ age: 3 }),
      helper.randomPet({ age: 4 }),
      helper.randomPet({ age: 4 }),
      helper.randomPet({ age: 5 }),
      helper.randomPet({ age: 6 }),
      helper.randomPet({ age: 6 }),
      helper.randomPet({ age: 6 }),
      helper.randomPet({ age: 7 }),
      helper.randomPet({ age: 7 }),
      helper.randomPet({ age: 8 }),
      helper.randomPet({ age: 8 }),
      helper.randomPet({ age: 8 }),
      helper.randomPet({ age: 11 }),
      helper.randomPet({ age: 24 }),
    ]);

    // query them via API
    return request(app.getHttpServer())
      .get(`/api/v1/pet?age[lte]=7`)
      .expect(HttpStatus.OK)
      .then((res) => {
        expect(res.body.totalCount).toEqual(16);
        expect(res.body.filteredCount).toEqual(11);
        expect(res.body.data.length).toEqual(11);
        res.body.data.forEach((pet: PetDto) => {
          expect(pet.age).toBeLessThanOrEqual(7);
        });
      });
  });

  it('should GET an array of Pets between age 5 and 10 with limit', async () => {
    // create a list of pets
    await Promise.all([
      helper.randomPet({ age: 1 }),
      helper.randomPet({ age: 2 }),
      helper.randomPet({ age: 3 }),
      helper.randomPet({ age: 4 }),
      helper.randomPet({ age: 4 }),
      helper.randomPet({ age: 5 }),
      helper.randomPet({ age: 6 }),
      helper.randomPet({ age: 6 }),
      helper.randomPet({ age: 6 }),
      helper.randomPet({ age: 7 }),
      helper.randomPet({ age: 7 }),
      helper.randomPet({ age: 8 }),
      helper.randomPet({ age: 8 }),
      helper.randomPet({ age: 8 }),
      helper.randomPet({ age: 11 }),
      helper.randomPet({ age: 24 }),
    ]);

    // query them via API
    return request(app.getHttpServer())
      .get(`/api/v1/pet?age[gt]=5&age[lt]=10&limit=2`)
      .expect(HttpStatus.OK)
      .then((res) => {
        expect(res.body.totalCount).toEqual(16);
        expect(res.body.filteredCount).toEqual(8);
        expect(res.body.data.length).toEqual(2);
        res.body.data.forEach((pet: PetDto) => {
          expect(pet.age).toBeGreaterThan(5);
          expect(pet.age).toBeLessThan(10);
        });
      });
  });

  it('should GET an array of the 17th page of Pets with limit 3 sorted by age ascending', async () => {
    // create a list of pets
    const pets: Array<Promise<PetDto>> = [];
    for (let i = 0; i < 125; i += 1) {
      pets.push(helper.randomPet({ age: i + 1 }));
    }
    const createdPets = (await Promise.all(pets)).map((entity) => entity);

    const limit = 3;
    const offset = limit * 17;
    // query them via API
    return request(app.getHttpServer())
      .get(`/api/v1/pet?limit=${limit}&offset=${offset}&sort=+age`)
      .expect(HttpStatus.OK)
      .then((res) => {
        expect(res.body.totalCount).toEqual(pets.length);
        expect(res.body.filteredCount).toEqual(pets.length);
        expect(res.body.data.length).toEqual(limit);
        res.body.data.forEach(async (pet: PetDto, idx: number) => {
          expect(pet).toEqual(createdPets[idx + offset]);
        });
      });
  });

  it('should GET an empty array of Pets a specified limit and offset outside the filtered range', async () => {
    // create a list of pets
    const pets: Array<Promise<PetDto>> = [];
    for (let i = 0; i < 125; i += 1) {
      pets.push(helper.randomPet({ age: i + 1 }));
    }
    const createdPets = (await Promise.all(pets)).map((entity) => entity);

    const limit = 100;
    const offset = 200;
    return request(app.getHttpServer())
      .get(`/api/v1/pet?limit=${limit}&offset=${offset}&age[gt]=9&age[lt]=100&sort=+age`)
      .expect(HttpStatus.OK)
      .then((res) => {
        expect(res.body.totalCount).toEqual(createdPets.length);
        expect(res.body.filteredCount).toEqual(90);
        expect(typeof res.body.data).toBe('object');
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toEqual(0);
      });
  });

  it('should GET an array of sorted pets by cost ascending', async () => {
    // create a list of pets
    const pets: Array<Promise<PetDto>> = [];
    for (let i = 0; i < 3; i += 1) {
      pets.push(helper.randomPet({ cost: i + 10 }));
    }
    const createdPets = (await Promise.all(pets)).map((entity) => entity);
    // query them via API
    return request(app.getHttpServer())
      .get(`/api/v1/pet?&sort=+cost`)
      .expect(HttpStatus.OK)
      .then((res) => {
        expect(res.body.totalCount).toEqual(pets.length);
        expect(res.body.filteredCount).toEqual(pets.length);
        expect(res.body.data.length).toEqual(pets.length);
        res.body.data.forEach(async (pet: PetDto, idx: number) => {
          if (idx > 0) {
            expect(res.body.data[idx - 1].cost).toBeLessThanOrEqual(pet.cost);
          }
        });
      });
  });

  it('should GET an array of sorted pets by cost descending', async () => {
    // create a list of pets
    const pets: Array<Promise<PetDto>> = [];
    for (let i = 0; i < 3; i += 1) {
      pets.push(helper.randomPet({ cost: i + 10 }));
    }
    const createdPets = (await Promise.all(pets)).map((entity) => entity);
    // query them via API
    return request(app.getHttpServer())
      .get(`/api/v1/pet?&sort=-cost`)
      .expect(HttpStatus.OK)
      .then((res) => {
        expect(res.body.totalCount).toEqual(pets.length);
        expect(res.body.filteredCount).toEqual(pets.length);
        expect(res.body.data.length).toEqual(pets.length);
        res.body.data.forEach(async (pet: PetDto, idx: number) => {
          if (idx > 0) {
            expect(res.body.data[idx - 1].cost).toBeGreaterThanOrEqual(pet.cost);
          }
        });
      });
  });

  it('should not be able to GET an array of sorted pets by createdAt', async () => {
    // create a list of pets
    const pets: Array<Promise<PetDto>> = [];
    // use large count because there's a chance of randomly achieving sort
    for (let i = 0; i < 100; i += 1) {
      // randomly bump the date because the collection ordering is undefined but helper uses increasing 'now'
      const randomDate = new Date();
      randomDate.setDate(randomDate.getDate() + Math.round(31 * Math.random()));

      pets.push(
        helper.randomPet({
          cost: i + 10,
          createdAt: randomDate,
        }),
      );
      // make sure to wait between each creation to make sure there is a testable time span between each pet
      await wait(10);
    }
    await Promise.all(pets);

    // query them via API
    return Promise.all([
      request(app.getHttpServer())
      .get(`/api/v1/pet?&sort=-createdAt`)
      .expect(HttpStatus.OK)
      .then((res) => {
        expect(res.body.totalCount).toEqual(pets.length);
        expect(res.body.filteredCount).toEqual(pets.length);
        expect(res.body.data.length).toEqual(pets.length);
        // should not be able to sort on dates
        expect(isDescending(res.body.data, 'createdAt')).not.toBe(true);
      }),
      request(app.getHttpServer())
      .get(`/api/v1/pet?&sort=+createdAt`)
      .expect(HttpStatus.OK)
      .then((res) => {
        expect(res.body.totalCount).toEqual(pets.length);
        expect(res.body.filteredCount).toEqual(pets.length);
        expect(res.body.data.length).toEqual(pets.length);
        // should not be able to sort on dates
        expect(isAscending(res.body.data, 'createdAt')).not.toBe(true);
      }),
    ]);
  });

  it('should not be able to GET an array of sorted pets by updatedAt', async () => {
    // create a list of pets
    const pets: Array<Promise<PetDto>> = [];
    for (let i = 0; i < 100; i += 1) {
      const randomDate = new Date();
      randomDate.setDate(randomDate.getDate() + Math.round(31 * Math.random()));

      pets.push(
        helper.randomPet({
          cost: i + 10,
          updatedAt: randomDate,
        }),
      ); // make sure to wait between each creation to make sure there is a testable time span between each pet
      await wait(10);
    }
    await Promise.all(pets);

    // query them via API
    return Promise.all([
      request(app.getHttpServer())
      .get(`/api/v1/pet?&sort=-updatedAt`)
      .expect(HttpStatus.OK)
      .then((res) => {
        expect(res.body.totalCount).toEqual(pets.length);
        expect(res.body.filteredCount).toEqual(pets.length);
        expect(res.body.data.length).toEqual(pets.length);
        // should not be able to sort on dates
        expect(isDescending(res.body.data, 'updatedAt')).not.toBe(true);
      }),
      request(app.getHttpServer())
      .get(`/api/v1/pet?&sort=+updatedAt`)
      .expect(HttpStatus.OK)
      .then((res) => {
        expect(res.body.totalCount).toEqual(pets.length);
        expect(res.body.filteredCount).toEqual(pets.length);
        expect(res.body.data.length).toEqual(pets.length);
        // should not be able to sort on dates
        expect(isAscending(res.body.data, 'updatedAt')).not.toBe(true);
      }),
    ]);
  });

  it('should GET an array of pets with cost eq to 2000', async () => {
    // create a list of pets
    const pets = [
      helper.randomPet({ cost: 1000 }),
      helper.randomPet({ cost: 2000 }),
      helper.randomPet({ cost: 2000 }),
      helper.randomPet({ cost: 2100 }),
    ];
    await Promise.all(pets);

    // query them via API
    return request(app.getHttpServer())
      .get(`/api/v1/pet?cost[eq]=2000`)
      .expect(HttpStatus.OK)
      .then((res) => {
        expect(res.body.totalCount).toEqual(pets.length);
        expect(res.body.filteredCount).toEqual(2);
        expect(res.body.data.length).toEqual(2);
        res.body.data.forEach((pet: PetDto) => {
          expect(pet.cost).toEqual(2000);
        });
      });
  });

  it('should GET an array of pets with type eq to Cat', async () => {
    // create a list of pets
    const pets = [
      helper.randomPet({ type: PetTypes.CAT }),
      helper.randomPet({ type: PetTypes.DOG }),
      helper.randomPet({ type: PetTypes.CAT }),
      helper.randomPet({ type: PetTypes.REPTILE }),
      helper.randomPet({ type: PetTypes.BIRD }),
    ];
    await Promise.all(pets);

    // query them via API
    return request(app.getHttpServer())
      .get(`/api/v1/pet?type[eq]=Cat`)
      .expect(HttpStatus.OK)
      .then((res) => {
        expect(res.body.totalCount).toEqual(pets.length);
        expect(res.body.filteredCount).toEqual(2);
        expect(res.body.data.length).toEqual(2);
        res.body.data.forEach((pet: PetDto) => {
          expect(pet.type).toEqual(PetTypes.CAT);
        });
      });
  });

  it('should GET an array of pets with name eq to "Foo Bar"', async () => {
    // create a list of pets
    const pets = [
      helper.randomPet(),
      helper.randomPet(),
      helper.randomPet({ name: 'Foo Bar' }),
      helper.randomPet(),
      helper.randomPet(),
    ];
    await Promise.all(pets);

    // query them via API
    return request(app.getHttpServer())
      .get(`/api/v1/pet?name[eq]=Foo Bar`)
      .expect(HttpStatus.OK)
      .then((res) => {
        expect(res.body.totalCount).toEqual(pets.length);
        expect(res.body.filteredCount).toEqual(1);
        expect(res.body.data.length).toEqual(1);
        res.body.data.forEach((pet: PetDto) => {
          expect(pet.name).toEqual('Foo Bar');
        });
      });
  });

  it('should GET an array of pets with name eq to "Foo Bar" and type eq "Cat"', async () => {
    // create a list of pets
    const pets = [
      helper.randomPet({ name: 'Foo Bar', type: PetTypes.BIRD }),
      helper.randomPet({ name: 'Foo Bar', type: PetTypes.CAT }),
      helper.randomPet({ name: 'Foo Bar', type: PetTypes.CAT }),
      helper.randomPet({ name: 'Baz Loo', type: PetTypes.CAT }),
      helper.randomPet({ name: 'Foo Bar', type: PetTypes.DOG }),
      helper.randomPet({ name: 'Foo Bar', type: PetTypes.REPTILE }),
    ];
    await Promise.all(pets);

    // query them via API
    return request(app.getHttpServer())
      .get(`/api/v1/pet?name[eq]=Foo Bar&type[eq]=Cat`)
      .expect(HttpStatus.OK)
      .then((res) => {
        expect(res.body.totalCount).toEqual(pets.length);
        expect(res.body.filteredCount).toEqual(2);
        expect(res.body.data.length).toEqual(2);
        res.body.data.forEach((pet: PetDto) => {
          expect(pet.name).toEqual('Foo Bar');
        });
      });
  });

  it('should POST a pet and see it created in the database', async () => {
    const createPetDto: CreatePetDto = {
      age: 4,
      name: 'Mr. Moewerton',
      type: PetTypes.CAT,
      cost: 100,
    };

    // create the pet via API
    return request(app.getHttpServer())
      .post(`/api/v1/pet`)
      .send(createPetDto)
      .expect(HttpStatus.CREATED)
      .then(async (res) => {
        // make sure the dto was returned and not the db entity
        expect(res.body._id).toBeUndefined();
        expect(res.body.__v).toBeUndefined();

        // make sure the entity was recorded in the database
        const petInDb = await model.findById(res.body.id);
        expect(res.body).toEqual(petInDb.toDto());
      });
  });

  it('should POST a malformed pet DTO and get a BAD_REQUEST error ', async () => {
    const createPetDto: CreatePetDto = {
      age: 4,
      name: 'Mr. Moewerton',
      type: PetTypes.CAT,
    } as CreatePetDto; // have to force it beacuse of the missing property

    // create the pet via API
    return request(app.getHttpServer()).post(`/api/v1/pet`).send(createPetDto).expect(HttpStatus.BAD_REQUEST);
  });

  it('should PATCH a pet and see it updated in the database', async () => {
    const createPetDto: CreatePetDto = {
      age: 6,
      name: 'Mr. Barkerton',
      type: PetTypes.DOG,
      cost: 101,
    };
    const createdPet = await model.create(createPetDto);

    // create the pet via API
    return request(app.getHttpServer())
      .patch(`/api/v1/pet/${createdPet.toDto().id}`)
      .send({ age: 7 })
      .expect(HttpStatus.OK)
      .then(async (res) => {
        // make sure the dto was returned and not the db entity
        expect(res.body._id).toBeUndefined();
        expect(res.body.__v).toBeUndefined();

        // make sure the entity was recorded in the database
        const petInDb = await model.findById(createdPet._id);

        // make sure update took
        expect(res.body.age).toEqual(7);
        // make sure updatedAt was updated
        expect(res.body.updatedAt).not.toEqual(createdPet.toDto().updatedAt);

        // make sure the pet in the database is equal to the updated pet reported from the API
        expect(res.body).toEqual(petInDb.toDto());
      });
  });

  it('should PATCH a non-existent pet DTO and get a NOT_FOUND error ', async () => {
    // create the pet via API
    return request(app.getHttpServer())
      .patch(`/api/v1/pet/${new MongooseTypes.ObjectId()}`)
      .send({ foo: 'bar' })
      .expect(HttpStatus.NOT_FOUND);
  });

  it('should DELETE a pet', async () => {
    const createPetDto: CreatePetDto = {
      age: 2,
      name: 'Ms. Polly',
      type: PetTypes.BIRD,
      cost: 1000,
    };
    const createdPet = await model.create(createPetDto);

    // create the pet via API
    return request(app.getHttpServer())
      .delete(`/api/v1/pet/${createdPet.toDto().id}`)
      .expect(HttpStatus.NO_CONTENT)
      .then(async () => {
        // make sure the entity was deleted in the database
        const petInDb = await model.findById(createdPet._id);
        expect(petInDb).toBeNull();
      });
  });

  it('should DELETE a non-existent pet DTO and get a NO_CONTENT error', async () => {
    // create the pet via API
    return request(app.getHttpServer())
      .delete(`/api/v1/pet/${new MongooseTypes.ObjectId()}`)
      .expect(HttpStatus.NO_CONTENT);
  });
});
