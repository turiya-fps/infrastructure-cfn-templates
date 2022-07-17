# Regional VPC networks

This CloudFormation template deploys/configures the regional VPC as well as the additional infrastructure internal to the VPC that facilitates the hosting of our API services.

## **Environments**

There are four VPCs modeled and deployed by this template, corresponding to the 2 stages *staging* and *prod* each with two regions `us-west-2` and `eu-west-2` (See Deployment).

## **Pre-requisites**
* Ubuntu or WSL
* Docker Commuity Edition
* SAM CLI - [Install the SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)

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

## **SSH Forwarding**

Should you need to SSH to a node in the cluster other than the tribunary node, you can do it via the`TribunarySecurityGroup` which forwards authorized SSH requests to private subnet instances via an explicit rule association between the instances' security groups (`BastionAllowOutboundSSHToPrivateInstance` and `PrivateInstanceAllowInboundSSHFromBastion`).

### Steps to connect:
1. Add your public IPv4 address as an inbound SSH rule on port 22 to the `TribunarySecurityGroup` of the region(s) you wish to access.
1. Obtain the private keys from the `elastic-prod-eu-west-2` and the `elastic-prod-us-west-2` key pairs, and copy them to `~/.ssh`. Apply the correct permission to each private key file (`chmod 600 ./elastic-prod-eu-west-2`)
1. Obtain the public IP of the tribunary node in the cluster you wish to access.
1. Obtain the private IP of the instance(s) you wish to connect to.
1. Add the public IP as `Hostname` of the tribunary host and the private IP to private instance host(s) in `~/.ssh/config`. This example adds the *staging-US* tribunary host and includes the two node instances:

    ```sh
    ### tribunary host for staging US
    Host tribunary-staging-us
     HostName 54.148.55.93
     User ec2-user
     Port 22
     IdentityFile ~/.ssh/elastic-key-prod-us-west-2

    ### private node staging US 1
    Host private-staging-us-1
     HostName 10.0.3.212
     User ec2-user
     IdentityFile ~/.ssh/elastic-key-prod-us-west-2
     ProxyJump tribunary-staging-us

    ### private node staging US 2
    Host private-staging-us-2
     HostName 10.0.0.114
     User ec2-user
     IdentityFile ~/.ssh/elastic-key-prod-us-west-2
     ProxyJump tribunary-staging-us
    ```
1. Run:
    ```
    $ ssh -J tribunary-staging-us test-staging-us-1
    ```

### SCP

To instantiate an `SCP` connection via the tribunary, you need to use the `-oProxyJump` option:
```sh
$ scp -oProxyJump=tribunary-staging-us testfile test-prod-eu-1:testfile
testfile                     
```

## **S3 Regional Endpoint**

The S3 VPC Endpoint (VPCE) allows any instance in a private subnet with the `S3EndpointSecurityGroup` attached to it to connect to any S3 bucket in the same region that has the following Condition in its policy statement:

```json
"Condition": {
    "ForAnyValue:StringEquals": {
        "aws:sourceVpce": [
            "<VPCE ID here>"
        ]
    }
}
```
- The bucket must be in the same region as the VPCE.
- The instance needs to have an IAM instance role with explicit access to the S3 bucket.
- To access a bucket via an endpoint you need to use a url based on the DNS name of its endpoint which can be obtained from the VPCE in the [console](https://eu-west-2.console.aws.amazon.com/vpc/home?region=eu-west-2#Endpoints:sort=vpcEndpointId).

Example:
```sh
$ aws s3 --region eu-west-2 --endpoint-url https://bucket.vpce-034b853f1ef27ca2a-096ywbd6.s3.eu-west-2.vpce.amazonaws.com ls s3://test-bucket-x4 --no-verify-ssl
```