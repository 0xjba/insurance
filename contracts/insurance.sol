// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

contract HealthInsurance {
    struct Policy {
        string name;
        string email;
        string healthCondition;
        uint256 purchaseTime;
        uint256 claimTime;
        bool isClaimed;
        string claimReason;
        uint256 expiryTime;
    }

    uint256 constant public premiumAmount = 10 wei;
    uint256 constant public policyDuration = 365 days;
    mapping (address => Policy) private policies;
    string[] eligibleClaimReasons = ["Accident", "Cancer", "Pneumonia", "Heart attack", "Kidney failure"];

    function buyPolicy(string memory name, string memory email, string memory healthCondition) public payable {
        require(msg.value == premiumAmount, "Premium amount is 10 wei");
        Policy memory policy = Policy(name, email, healthCondition, block.timestamp, 0, false, "", block.timestamp + policyDuration);
        policies[msg.sender] = policy;
    }

    function getPolicyDetails() public view returns (string memory, string memory, string memory, uint256, uint256, bool, string memory, uint256) {
        Policy memory policy = policies[msg.sender];
        require(policy.purchaseTime > 0, "No policy found for the sender");
        uint256 remainingDays = 0;
        if (block.timestamp < policy.expiryTime) {
            remainingDays = (policy.expiryTime - block.timestamp) / (1 days);
        }
        return (policy.name, policy.email, policy.healthCondition, policy.purchaseTime, policy.claimTime, policy.isClaimed, policy.claimReason, remainingDays);
    }

    function claimPolicy(string memory reason) public {
        Policy storage policy = policies[msg.sender];
        require(policy.purchaseTime > 0, "No policy found for the sender");
        require(!policy.isClaimed, "Policy already claimed");
        require(block.timestamp < policy.expiryTime, "Policy expired");
        
        bool isEligibleClaimReason = false;
        for (uint256 i = 0; i < eligibleClaimReasons.length; i++) {
            if (keccak256(bytes(eligibleClaimReasons[i])) == keccak256(bytes(reason))) {
                isEligibleClaimReason = true;
                break;
            }
        }
        require(isEligibleClaimReason, "Ineligible for claim");

        policy.isClaimed = true;
        policy.claimTime = block.timestamp;
        policy.claimReason = reason;
        payable(msg.sender).transfer(premiumAmount);
    }
}
