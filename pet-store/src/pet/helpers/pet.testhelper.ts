import { Model } from 'mongoose';
import PetDto from '../dtos/pet.dto';
import { Pet, PetTypes } from '../schemas/pet.schema';

/*
  This is a helper class to assist you in writing tests.
*/

export default class PetTestHelper {
  private watched: Pet[] = [];

  constructor(private readonly petModel: Model<Pet>) {}

  watchEntity(entity: Pet) {
    this.watched.push(entity);
  }

  async deleteWatched() {
    await Promise.all(
      this.watched.map(async (entity) => {
        return Promise.all([this.petModel.deleteOne({ surveyId: entity._id }).exec()]);
      }),
    );
    this.watched = [];
  }

  async randomPet(overrides: Partial<Pet> = {}): Promise<PetDto> {
    const now = new Date().toISOString();

    const entity = new this.petModel({
      name: PetTestHelper.randString(10),
      age: PetTestHelper.getRandomInt(1, 25),
      cost: PetTestHelper.getRandomInt(100, 3000),
      type: PetTestHelper.getRandomEnumValue(PetTypes),
      createdAt: now,
      updatedAt: now,
    });
    if (overrides.name) {
      entity.name = overrides.name;
    }
    if (overrides.age) {
      entity.age = overrides.age;
    }
    if (overrides.type) {
      entity.type = overrides.type;
    }
    if (overrides.createdAt) {
      entity.createdAt = overrides.createdAt;
    }
    if (overrides.updatedAt) {
      entity.updatedAt = overrides.updatedAt;
    }
    await entity.save();
    this.watchEntity(entity);
    return entity.toDto();
  }

  static getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  static getRandomEnumValue<T>(anEnum: T): T[keyof T] {
    //save enums inside array
    const enumValues = Object.keys(anEnum) as Array<keyof T>;

    //Generate a random index (max is array length)
    const randomIndex = Math.floor(Math.random() * enumValues.length);
    // get the random enum value

    const randomEnumKey = enumValues[randomIndex];
    return anEnum[randomEnumKey];
  }

  static randWords(length: number, wordLengthMax = 10) {
    let result = '';
    for (let i = 0; i < length; i += 1) {
      if (result !== '') {
        result = result + ' ';
      }
      result = result + PetTestHelper.randString(wordLengthMax);
    }
    return result;
  }

  static randString(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
      counter += 1;
    }
    return result;
  }
}
