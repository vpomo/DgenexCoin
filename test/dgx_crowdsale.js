var DGXCrowdsale = artifacts.require("./DGXCrowdsale.sol");
//import assertRevert from './helpers/assertRevert';

contract('DGXCrowdsale', (accounts) => {
    var contract;
    var owner = "0x19C8FDc9499887a590DE0Bb07837f7661391A87c";
    var rate = 1000*1.3;
    var buyWei = 5 * 10**17;
    var rateNew = 1000*1.3;
    var buyWeiNew = 5 * 10**17;
    var buyWeiMax = 11 * 10**18;

    var totalSupply = 1e+28;

    it('should deployed contract', async ()  => {
        assert.equal(undefined, contract);
        contract = await DGXCrowdsale.deployed();
        assert.notEqual(undefined, contract);
    });

    it('get address contract', async ()  => {
        assert.notEqual(undefined, contract.address);
    });

    it('verification balance owner contract', async ()  => {
        var balanceOwner = await contract.balanceOf(owner);
        //console.log("balanceOwner = " + balanceOwner);
        assert.equal(5e+27, balanceOwner);
    });

    it('verification of receiving Ether', async ()  => {
        var tokenAllocatedBefore = await contract.tokenAllocated.call();
        var balanceAccountTwoBefore = await contract.balanceOf(accounts[2]);
        var weiRaisedBefore = await contract.weiRaised.call();
        //console.log("tokenAllocatedBefore = " + tokenAllocatedBefore);

        var numberToken = await contract.validPurchaseTokens.call(Number(buyWei));
        //console.log(" numberTokens = " + JSON.stringify(numberToken));
        //console.log("numberTokens = " + numberToken);

        await contract.buyTokens(accounts[2],{from:accounts[2], value:buyWei});
        var tokenAllocatedAfter = await contract.tokenAllocated.call();
        //console.log("tokenAllocatedAfter = " + tokenAllocatedAfter);

        assert.isTrue(tokenAllocatedBefore < tokenAllocatedAfter);
        assert.equal(0, tokenAllocatedBefore);
        assert.equal(rate*buyWei, tokenAllocatedAfter);

        var balanceAccountTwoAfter = await contract.balanceOf(accounts[2]);
        assert.isTrue(balanceAccountTwoBefore < balanceAccountTwoAfter);
        assert.equal(0, balanceAccountTwoBefore);
        assert.equal(rate*buyWei, balanceAccountTwoAfter);

        var weiRaisedAfter = await contract.weiRaised.call();
        //console.log("weiRaisedAfter = " + weiRaisedAfter);
        assert.isTrue(weiRaisedBefore < weiRaisedAfter);
        assert.equal(0, weiRaisedBefore);
        assert.equal(buyWei, weiRaisedAfter);

        var depositedAfter = await contract.getDeposited.call(accounts[2]);
        //console.log("DepositedAfter = " + depositedAfter);
        assert.equal(buyWei, depositedAfter);

        var balanceAccountThreeBefore = await contract.balanceOf(accounts[3]);
        await contract.buyTokens(accounts[3],{from:accounts[3], value:buyWeiNew});
        var balanceAccountThreeAfter = await contract.balanceOf(accounts[3]);
        assert.isTrue(balanceAccountThreeBefore < balanceAccountThreeAfter);
        assert.equal(0, balanceAccountThreeBefore);
        //console.log("balanceAccountThreeAfter = " + balanceAccountThreeAfter);
        assert.equal(rateNew*buyWeiNew, balanceAccountThreeAfter);

        var balanceOwnerAfter = await contract.balanceOf(owner);
        //console.log("balanceOwnerAfter = " + Number(balanceOwnerAfter));
        //assert.equal(totalSupply - balanceAccountThreeAfter - balanceAccountTwoAfter, balanceOwnerAfter);

    });

    it('verification valid purchase token', async ()  => {
        var newByWei = 1 * 10**17;
        var numberToken = await contract.validPurchaseTokens.call(Number(newByWei));
        assert.equal( newByWei*rate, numberToken);
        //console.log("numberToken = " + numberToken);

        var tokenAllocatedBefore = await contract.tokenAllocated.call();
        //console.log("tokenAllocatedBefore = " + tokenAllocatedBefore);
        newByWei = 6 * 10**18;
        numberToken = await contract.validPurchaseTokens.call(Number(newByWei));
        await contract.buyTokens(accounts[3],{from:accounts[3], value:newByWei});
        var tokenAllocated = await contract.tokenAllocated.call();
        //console.log("tokenAllocated = " + tokenAllocated);
        assert.equal( newByWei*rate, numberToken);
        //assert.equal(Number(tokenAllocatedBefore) < Number(tokenAllocated));
    });

    it('verification tokens limit max amount', async ()  => {
            var numberTokensMaxWey = await contract.validPurchaseTokens.call(buyWeiMax);
            assert.equal(0, numberTokensMaxWey);
    });

    it('verification burning unsold tokens', async ()  => {
            var tokenAllocated = await contract.tokenAllocated.call();
            //console.log("tokenAllocated = " + tokenAllocated);

            var totalSupplyBefore = await contract.totalSupply.call();
            //console.log("totalSupplyBefore = " + totalSupplyBefore);

            var numberTokensBurn = await contract.ownerBurnToken.call();
            //console.log("numberTokensBurn = " + numberTokensBurn);
            await contract.ownerBurnToken();
            var totalSupplyAfter = await contract.totalSupply.call();
            //console.log("totalSupplyAfter = " + totalSupplyAfter);
            assert.equal(Number(totalSupplyAfter), Number(tokenAllocated*2));
            assert.equal(numberTokensBurn, totalSupplyBefore - tokenAllocated);
    });

});



