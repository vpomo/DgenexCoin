const DGXCrowdsale = artifacts.require('./DGXCrowdsale.sol');

module.exports = (deployer) => {
    //http://www.onlineconversion.com/unix_time.htm
    var owner =  "0x19C8FDc9499887a590DE0Bb07837f7661391A87c";
    var wallet = "0x7785F9b1B0324b94805c2f188707000d0047D798";
    deployer.deploy(DGXCrowdsale, owner, wallet);
};
