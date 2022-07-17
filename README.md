# Cloudformation Infrastructure Projects

## Includes the following IaC templates as sub-projects:
| Subdirectory | Project Description |
|--|--|
| `autocomplete-api-vpc/` | The VPC that hosts the Elastic cloudformation cluster and most of our Lambda API layer |
| `autocomplete-api-dynamodb/` | DynamoDB Tables and related VPC Endpoints and Security Groups |
| `admin-api-vpc/` | The VPC that hosts the Admin API (London) and any dependent Lambda functions |
| `application-load-balancer/` | The ALB responsible for routing traffic to all Lambdas |


### Please refer to each sub-project's README for development and deployment info