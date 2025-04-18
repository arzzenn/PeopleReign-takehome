import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import PetDto from '../dtos/pet.dto';

export type PetDocument = HydratedDocument<Pet>;

export enum PetTypes {
  BIRD = 'Bird',
  CAT = 'Cat',
  DOG = 'Dog',
  REPTILE = 'Reptile',
}

@Schema({ collection: 'pet', timestamps: true })
export class Pet {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ required: true, comment: "This pet's name" })
  name: string;

  @Prop({ required: true, comment: 'The age in years this pet is.' })
  age: number;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(PetTypes),
    comment: 'The type of pet this is.',
  })
  type: string;

  @Prop({ required: true, comment: 'Cost in USD pennies. $4.50 would be represented here as 450.' })
  cost: number;

  toDto(): PetDto {
    return {
      id: this._id.toString(),
      name: this.name,
      age: this.age,
      cost: this.cost,
      type: this.type as PetTypes,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}

export const PetSchema = SchemaFactory.createForClass(Pet);

PetSchema.loadClass(Pet);
