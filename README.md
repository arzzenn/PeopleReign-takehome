# PeopleReign Take Home Test

## Introduction
Thank you for taking the time to complete this test.  This test is intended to test a candidate's ability to work in a code base they don't know, use of every day tools in use at PeopleReign like Docker, as well as writing new code in a language of the candidate's choice.

## Perquisites
1. docker and docker-compose installed
1. NodeJS installed (version 20 is what we used to make the test)
1. Start the database so you can run the pet-store and it's integration tests: `docker-compose down && docker-compose up`
    - This command will bring up a mongo instance listening on your local host's port 27017
    - The mongo instance will be initiated with a pet-store database containing a populated pet collection
    - The `docker-compose down` "preamble" in the command allows you to re-issue the command and have the mongo instance pop back up fully-populated. This is important to do once you have updated the pet-store app and before writing the query script.

## Tasks
1. Update the pet-store so all integration tests are passing
    - Read the pet-store README to learn how to setup and run locally
    - This task will require changes to the `pet.service.ts` file
1. Update the pet-store's `pet.service.ts` file to implement any functions that are not implemented yet (search for: `Method not implemented`).
1. Double check: make sure all tests are passing and 100% code coverage is achieved
1. Write a query-script that answers the questions by querying the pet-shop API:
    - Notes and Hints:
      - Restart mongo to make sure it re-populates the pet collection: `docker-compose down && docker-compose up` (run this as many times as you like whenever you need to reset to a fully populated database)
      - See the provided `query-script/src/main.ts` file for example on formatting as well as a good bootstrap to get you headed in the right direction.
      - A TypeScript harness and example has been included in the `query-script` directory.
      - If you would rather use a different language you are welcome to do so. If you do, you will need to adjust the associated `Dockerfile` such that the scripts in the "How Will This Be Evaluated?" section run correctly.
      - If you do choose a different language, please select one that allows performant API querying.
      - Write the most latency-efficient code where latency is defined as the time it takes your code to answer a question. Ignore this directive for question 9.
      - If you round any of your answers, round to the nearest penny
      - If the question asks for a cost/price, answer in the form of USD, e.g. $90.00
    - Questions:
      1. How many total pets are in the pet-shop?
      1. How many birds are in the pet-shop?
      1. How many cats are in the pet-shop?
      1. How many dogs are in the pet-shop?
      1. How many reptiles are in the pet-shop?
      1. How many cats are there with age equal to or greater than 5 in the pet-shop?
      1. How much would it cost to buy all the birds in the pet-shop?
      1. What is the average age of pets that cost less than $90.00?
      1. What is the name of the 3rd most recently updated dog?
          - Implement this with the most memory efficient code you can

## How Will This Be Evaluated?
Great question.  We will:
1. Unzip your submission
1. `cd take-home-project`
1. Run the integration tests
    - ```bash
      $ cd pet-store
      $ docker-compose -f docker-compose.integration-test.yml down \
        && docker-compose -f docker-compose.integration-test.yml up --build --exit-code-from pet-store \
        && docker-compose -f docker-compose.integration-test.yml logs pet-store
      ```
    - Observe the pet-store integration test output and coverage metrics to make sure they all pass and there is 100% code coverage (no uncovered line #s)
1. Run the query-script
    - ```bash
      $ docker-compose -f docker-compose.query-script.yaml down \
        && docker-compose -f docker-compose.query-script.yaml up --build --exit-code-from query-script \
        && docker-compose -f docker-compose.query-script.yaml logs query-script
      ```
    - Observe the query-script output for all questions and their corresponding answers

## To to submit your work
Zip up your project and **please** remove remove node_modules before you do. Here is a sequence of commands to do so, for convenience:
```bash
# go up a directory to make sure we capture the take-home-project directory as the top level object
$ cd ../
# remove any existing zip file
$ rm -f take-home-project.zip
# Create a zip file ignoring node_modules, coverage metrics, and build directories 
$ zip -r take-home-project.zip take-home-project -x \
    take-home-project/pet-store/node_modules/\* \
    take-home-project/pet-store/coverage-integration/\* \
    take-home-project/pet-store/dist/\* \
    take-home-project/query-script/node_modules/\*
```

Email your submission directly to: `careers@peoplereign.io` or reply the original email that invited to you submit this take home project.

New email Subject: `Engineering Take Home Project Submission`

Please include answers to the following in the body of your email:
```
I am legally allowed to work in the United States: []
I do not need Visa sponsorship: []
Copy and paste of the query-script output of your finished project:

```

Please attach a copy of your resume to the email as well.

