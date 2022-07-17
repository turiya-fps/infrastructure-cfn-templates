# Application Load Balancer

Template to deploy/configure the API load balancers and Rate-Limiting ACLs. These are deployed as two seperate CloudFormation stacks from a single template.

## **Pre-requisites**
* Docker - [Install Docker community edition](https://hub.docker.com/search/?type=edition&offering=community)
* SAM CLI - [Install the SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)


## **Environments**
There are 2 load balancers currently in deployment, one for the staging system and one for the prod system, both are in `us-west-2`.

## **Infrastructure**

For each stage (staging and prod) a Global Accelerator distributes requests between the two regional ALBs according to in-built latency measurements. The ALBs are each registered as endpoints in regional endpoint groups against the accelerators. The following describes the relationships.

| Accelerator Name | Stage | Endpoint group | Endpoint ALB Name | `config-env` |
|--|--|--|--|--|
| `FetchifyApiSTAGING` | Staging | `eu-west-2` | ALB-eu-west-2-STAGING | staging-EU
| " " | " " | `us-west-2` | ALB-us-west-2-STAGING | staging-US
| `FetchifyApiPROD` | Prod | `eu-west-2` | ALB-eu-west-2-PROD | prod-EU
| " " | " " | `us-west-2` | ALB-us-west-2-PROD | prod-US

## **Rate-Limiting**
Rate Limiting on the API is done at the ALB level by the attached Web Application Firewall ACL (on a separate CF stack to the ALB). Configuring rate limits can be done by modifying the WebACL using the template, where we can set a 5-minute limit per client IP address for a specified route. Beyond this limit, requests will get a 403 response.

## **Deployment**
Deployment is done manually using the SAM CLI. If reconfigured via the template the live ALBs each need to be updated separately by region / stage. To deploy an updated ALB stack run the following command with the correct `config-env` as above.
```
$ sam build
$ sam deploy --config-env <config-env>
```

> **N.b.** If working in WSL/Linux you may have to synchronise your system's clock with AWS by running 
> `sudo ntpdate pool.ntp.org`

## **Stack protection**

Deployed ALB stacks have *termination protection* enabled, preventing their accidental deletion.

## Healthcheck settings

Health checks are the mechanism for regional failover kicking in. If Global Accelerator's healthchecker can't get a success response from a particular ALB endpoint group 3 times consecutively, it will route traffic to the other regional endpoint group regardles of endpoint weighting. If it is targeting a Lambda, an endpoint group's healthcheck needs to be configured in the AWS console as well as inside the Lambda. The healthcheck settings should be:

| Setting | Value |
|---|---|
| Heath check protocol | TCP |
| Health check port | 443 |
