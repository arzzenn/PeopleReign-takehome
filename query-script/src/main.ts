// use bluebird promises (has more concurrent options)
import * as Promise from 'bluebird';
// use axios to make HTTP API calls to the pet-store
import axios from 'axios';
// import quick and dirty pet store api types
import {PetTypes, PetDto, PetListWithCountsDto } from './pet-store-api-types';

// Set some constants based on the environment such that this script can run locally or in a docker container
const PET_STORE_HOST = process.env.PET_STORE_HOST || 'localhost';
const PET_STORE_PORT = parseInt(process.env.PET_STORE_PORT || '3330', 10);
const PET_STORE_URL = `http://${PET_STORE_HOST}:${PET_STORE_PORT}`;
const PET_STORE_URL_PET_API_V1 = `${PET_STORE_URL}/api/v1/pet`;

// example function to get you started
const printTotalCounts = async () => {
  const results = await Promise.all([
    axios.get<PetListWithCountsDto>(`${PET_STORE_URL_PET_API_V1}?type=${PetTypes.BIRD}&limit=1`),
    axios.get<PetListWithCountsDto>(`${PET_STORE_URL_PET_API_V1}?type=${PetTypes.CAT}&limit=1`),
  ]);
  console.log(`How many total pets are in the pet-shop? ${results[0].data.totalCount}`);
  console.log(`How many birds are in the pet-shop? ${results[0].data.filteredCount}`);
  console.log(`How many cats are in the pet-shop? ${results[1].data.filteredCount}`);
}

(async () => {
  await printTotalCounts();
  // TODO: add more functions here to answer other questions
})();
