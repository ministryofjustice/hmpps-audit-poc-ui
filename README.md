[![CircleCI](https://circleci.com/gh/ministryofjustice/hmpps-audit-poc-ui/tree/main.svg?style=svg)](https://circleci.com/gh/ministryofjustice/hmpps-audit-poc-ui)
[![Known Vulnerabilities](https://snyk.io/test/github/ministryofjustice/hmpps-audit-poc-ui/badge.svg)](https://snyk.io/test/github/ministryofjustice/hmpps-audit-poc-ui)

# hmpps-audit-poc-ui
A POC to investigate how to capture audit information for frontend applications.

## Latest
This is currently a skeleton Typescript UI project and no extra functionality has been added.

### Running the Cypress tests
You need to fire up the wiremock server first:
```
docker-compose -f docker-compose-test.yml up
```

### Starting feature tests node instance
A separate node instance needs to be started for the feature tests. This will run on port 3008 and won't conflict
with any of the api services.
```
npm run start-feature:dev
```

### Running the tests
With the UI:
```
npm run int-test-ui
```














