const DGXCrowdsale = artifacts.require('./DGXCrowdsale.sol');

module.exports = (deployer) => {
    //http://www.onlineconversion.com/unix_time.htm
    var owner = "0xcbab91b18583ba3c282179d406ccebe8ce3058ed";
    deployer.deploy(DGXCrowdsale, owner);
};
