## Health Insurance dApp

The Health Insurance dApp is built on a blockchain-powered smart contract that offers a privacy & seamless experience for users to purchase and claim health insurance policies.

### Smart Contract

Contract Address can be found on /src/App.js

Contract ABI can be found in /src/Insurance.json

Contract is deployed on Obscuro testnet.

This is a smart contract for a health insurance policy that operates on blockchain. The contract defines a `Policy` struct, which stores information about the policy holder, their health condition, the time of purchase, whether a claim has been made, the reason for the claim, and the expiration time of the policy.

### Policy Struct

The `Policy` struct has the following fields:

-   `name` (string): the name of the policy holder
-   `email` (string): the email address of the policy holder
-   `healthCondition` (string): the health condition of the policy holder
-   `purchaseTime` (uint256): the time of purchase, as a Unix timestamp
-   `claimTime` (uint256): the time of the claim, as a Unix timestamp
-   `isClaimed` (bool): whether a claim has been made on the policy
-   `claimReason` (string): the reason for the claim
-   `expiryTime` (uint256): the time at which the policy expires, as a Unix timestamp

### Constants

The contract has two constants:

-   `premiumAmount` (uint256): the amount required to purchase a policy, set to 10 wei
-   `policyDuration` (uint256): the duration of the policy in days, set to 365 days

### Mapping

The contract uses a mapping to store policies, with the keys being Ethereum addresses and the values being `Policy` structs:

    mapping (address => Policy) private policies;
    
### Eligible Claim Reasons

The contract has an array called `eligibleClaimReasons`, which lists the reasons for which a claim can be made:

    string[] eligibleClaimReasons = ["Accident", "Cancer", "Pneumonia", "Heart attack", "Kidney failure"];

### Functions

The contract has three main functions:

#### `buyPolicy`

Allows a user to purchase a policy by paying the `premiumAmount` of 10 wei and providing their name, email, and health condition. The function creates a new `Policy` struct with the provided information and assigns it to the sender's address in the `policies` mapping.

#### `getPolicyDetails` Function

This function returns the policy details of the caller in a tuple. If no policy is found for the caller's address, a `require` statement will prevent the function from executing. The remaining number of days until the policy expires is also calculated and returned.

#### `claimPolicy` Function

This function allows a user to make a claim on their health insurance policy. The function first checks that a policy exists for the caller's address, that the policy has not already been claimed, and that the policy has not expired. It then checks if the claim reason provided is eligible by checking it against the `eligibleClaimReasons` array. If the claim reason is eligible, the policy is marked as claimed and the claim time and reason are set. The `premiumAmount` is then transferred back to the caller's address.

### Additional Elements

#### `Policy` Struct

This struct defines the properties of a health insurance policy, including the name and email of the policy holder, their health condition, the time the policy was purchased, the time the policy was claimed (if applicable), whether the policy has been claimed, the reason for the claim (if applicable), and the time the policy expires.

#### `eligibleClaimReasons` Array

This array contains a list of eligible claim reasons for a health insurance policy. When a user attempts to make a claim, their provided reason will be checked against this list to determine if it is eligible.

#### `premiumAmount` and `policyDuration` Constants

These constants define the cost of a policy premium and the duration of a policy, respectively.

#### `mapping (address => Policy) private policies` Mapping

This mapping associates an address with a `Policy` struct, allowing the contract to retrieve a user's policy details by their address.

#### `uint256` Data Type

This data type is used throughout the contract to represent unsigned 256-bit integers.
