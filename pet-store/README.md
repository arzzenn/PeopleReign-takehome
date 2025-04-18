# Pet Store
This application is written in TypeScript using the NestJS framework.

## To develop and run locally

### 
```bash
# from the pet-store directory
$ npm i
```

## Test
```bash
# all tests (alias for test:integration)
$ npm run test

# integration tests
$ npm run test:integration

# integration tests with coverage
$ npm run cover:integration

# tests that match a specific pattern
$ npm run test -- --testNamePattern='range is'

# tests in file(s) that match regex pattern
$ npm run test -- --testRegex '.*values.ispec'
```

## Updating NestJS
```bash
# Update all NestJS packages to be the latest
$ npx npm-check-updates "/nestjs*/" -u
```
