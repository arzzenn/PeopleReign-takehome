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

// Helper function to format currency from pennies to USD string
const formatUSD = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};

// Get counts for all pet types and total pets
const printTotalCounts = async () => {
  const typeQueries = Object.values(PetTypes).map(type => 
    axios.get<PetListWithCountsDto>(PET_STORE_URL_PET_API_V1, {
      params: {
        'type[eq]': type,
        limit: 0
      }
    })
  );

  const totalQuery = axios.get<PetListWithCountsDto>(PET_STORE_URL_PET_API_V1, {
    params: { limit: 0 }
  });

  const results = await Promise.all([totalQuery, ...typeQueries]);
  
  const totalCount = results[0].data.totalCount;
  const [birdCount, catCount, dogCount, reptileCount] = results.slice(1).map(r => r.data.filteredCount);

  console.log(`1. How many total pets are in the pet-shop? ${totalCount}`);
  console.log(`2. How many birds are in the pet-shop? ${birdCount}`);
  console.log(`3. How many cats are in the pet-shop? ${catCount}`);
  console.log(`4. How many dogs are in the pet-shop? ${dogCount}`);
  console.log(`5. How many reptiles are in the pet-shop? ${reptileCount}`);
};

// Get count of cats aged 5 or older
const getOldCats = async () => {
  const response = await axios.get<PetListWithCountsDto>(PET_STORE_URL_PET_API_V1, {
    params: {
      'type[eq]': PetTypes.CAT,
      'age[gte]': 5,
      limit: 0
    }
  });
  console.log(`6. How many cats are there with age equal to or greater than 5 in the pet-shop? ${response.data.filteredCount}`);
};

// Calculate total cost of all birds
const getBirdsCost = async () => {
  const response = await axios.get<PetListWithCountsDto>(PET_STORE_URL_PET_API_V1, {
    params: {
      'type[eq]': PetTypes.BIRD,
      limit: 5648
    }
  });
  const totalCost = response.data.data.reduce((sum, bird) => sum + bird.cost, 0);
  console.log(`7. How much would it cost to buy all the birds in the pet-shop? ${formatUSD(totalCost/100)}`); // Convert pennies to dollars
};

// Calculate average age of pets under $90
const getAverageAgeUnder90 = async () => {
  const response = await axios.get<PetListWithCountsDto>(PET_STORE_URL_PET_API_V1, {
    params: {
      'cost[lt]': 9000, // $90.00 in pennies
      limit: 5648
    }
  });
  const pets = response.data.data;
  if (pets.length === 0) {
    console.log(`8. What is the average age of pets that cost less than $90.00? No pets found under $90.00`);
    return;
  }
  const averageAge = pets.reduce((sum, pet) => sum + pet.age, 0) / pets.length;
  console.log(`8. What is the average age of pets that cost less than $90.00? ${averageAge.toFixed(2)}`);
};

// Get 3rd most recently updated dog
const getThirdMostRecentlyUpdatedDog = async () => {
  const response = await axios.get<PetListWithCountsDto>(PET_STORE_URL_PET_API_V1, {
    params: {
      'type[eq]': PetTypes.DOG,
      sort: '-updatedAt',
      limit: 3
    }
  });
  
  if (response.data.data.length < 3) {
    console.log(`9. What is the name of the 3rd most recently updated dog? Not enough dogs found`);
    return;
  }
  
  const thirdDog = response.data.data[2];
  console.log(`9. What is the name of the 3rd most recently updated dog? ${thirdDog.name}`);
};

(async () => {
  try {
    await printTotalCounts();
    await getOldCats();
    await getBirdsCost();
    await getAverageAgeUnder90();
    await getThirdMostRecentlyUpdatedDog();
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
    } else {
      console.error('Error executing queries:', error);
    }
    process.exit(1);
  }
})();
