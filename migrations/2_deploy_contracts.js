const DGXCrowdsale = artifacts.require('./DGXCrowdsale.sol');

module.exports = (deployer) => {
    //http://www.onlineconversion.com/unix_time.htm
    var owner = "0x55Ecc562c95f19488943c7a7fD1FC3766594D920";
    deployer.deploy(DGXCrowdsale, owner);
};
