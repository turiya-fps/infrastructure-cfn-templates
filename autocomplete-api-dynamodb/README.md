# DynamoDB Tables for Internal Tokens

This CloudFormation template deploys/configures the DynamoDB Tables for managing customer tokens as well as the additional infrastructure internal to the VPC that allows access to the DynamoDB Tables from Lamda functions, including VPC Endpoints and Security Groups.

## **Environments**

There are four DynamoDB Tables modeled and deployed by this template, corresponding to the 2 stages *staging* and *prod* each with two regions `us-west-2` and `eu-west-2` (See Deployment).

## **Pre-requisites**
* Ubuntu or WSL
* Docker Commuity Edition
* SAM CLI - [Install the SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)

## **Development**
To use the DynamoDB Tables locally for development purposes, you can launch Local DynamoDB by running `docker-compose up -d` in the root folder.

To create tables run `docker exec -it regional-vpcs_nodejs npm run autocomplete-api-dynamodb:create` in the root folder.

To delete tables run `docker exec -it regional-vpcs_nodejs npm run autocomplete-api-dynamodb:delete` in the root folder.

## **Deployment**

| Region | Stage | `config-env` |
|--|--|--|
| eu-west-2 | Staging | `staging-EU` |
| " " | Prod | `prod-EU` |
| us-west-2 | Staging | `staging-US` |
| " " | Prod | `prod-US` |

Deployment/updating is done manually using the SAM CLI. If reconfigured via the template the environments each need to be redeployed separately. To deploy an updated resource set run the following for each region, passing the respective `--config-env` argument as above.
```
$ sam build
$ sam deploy --config-env <config-env>
```

> **N.b.** If working in WSL/Linux you may have to synchronise your system's clock with AWS by running 
> `sudo ntpdate pool.ntp.org`

## **Stack protection**

Deployed stacks have *termination protection* enabled, preventing their accidental deletion.
