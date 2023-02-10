//SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.4.20;
import "./CrowdFundingWithDeadline.sol";

contract TestCrowdFundingWithDeadline is CrowdFundingWithDeadline {
    uint time;

    constructor(
        string memory contractName,
        uint targetAmountEth,
        uint durationInMin,
        address payable beneficiaryAddress
    )
        CrowdFundingWithDeadline(contractName, targetAmountEth, durationInMin, beneficiaryAddress)
    {

    }

    function currentTime() internal override view returns(uint) {
        return time;
    }

    function setCurrentTime(uint newTime) public {
        time = newTime;
    }
}
