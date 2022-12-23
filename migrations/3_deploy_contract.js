var CrowdFundingWithDeadline = artifacts.require("./CrowdFundingWithDeadline.sol");

module.exports = function(deployer) {
  deployer.deploy(
    CrowdFundingWithDeadline, 
    "Fund Raiser",
    40,
    10000000,
    "0x77E7B172f1Cd81508bd7C252bCBf60028dD024A1"
  );
};
