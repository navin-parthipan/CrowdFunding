var CrowdFundingWithDeadline = artifacts.require("./CrowdFundingWithDeadline.sol");

module.exports = function(deployer) {
  deployer.deploy(
    CrowdFundingWithDeadline, 
    "Fund Raiser",
    40,
    28800,
    "0x4f03845Bf98Dd2aeF163F64ECC2c643868655473" //account 4 => beneficiary
  );
};
