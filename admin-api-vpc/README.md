# Admin API Infrastructure Code

This CloudFormation template deploys/configures the regional VPCs hosting the Admin API.

## **Environments**

There are 2 VPCs modelled and deployed by this template, corresponding to the 2 stages *staging* and *prod* (See Deployment).

## **Pre-requisites**
* Ubuntu or WSL
* Docker Community Edition
* SAM CLI - [Install the SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
* [Optional] Cloudformation Plugin for VSCode - Extension ID = **aws-scripting-guy.cform**

## **Deployment**

| Region | Stage | `config-env` |
|--|--|--|
| eu-west-2 | Staging | `staging` |
| " " | Production | `prod` |

Deployment/updating is done manually using the SAM CLI. If reconfigured via the template the environments each need to be redeployed separately. To deploy an updated resource set run the following for each region, passing the respective `--config-env` argument as above.
```
$ sam build
$ sam deploy --config-env <config-env>
```

> **N.b.** Sometimes working in WSL/Linux  you get the following deploy error:
> ```
> The difference between the request time and the current time is too large.
> ```
> This means you have to synchronise your system's clock with AWS by running 
> `sudo ntpdate pool.ntp.org`

## **Stack protection**

Deployed stacks have *termination protection* enabled, preventing their accidental deletion.