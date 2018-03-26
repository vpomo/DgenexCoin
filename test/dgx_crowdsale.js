var DGXCrowdsale = artifacts.require("./DGXCrowdsale.sol");
//import assertRevert from './helpers/assertRevert';

contract('DGXCrowdsale', (accounts) => {
    var contract;
    var owner = "0x55Ecc562c95f19488943c7a7fD1FC3766594D920";
    var rate = 4000;
    var buyWei = 5 * 10**17;
    var rateNew = 4000;
    var buyWeiNew = 5 * 10**17;
    var buyWeiMin = 1 * 10**16;
    var buyWeiCap = 14412 * (10 ** 18);

    var period = 0;

    var totalSupply = 1e+26;

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
        assert.equal(totalSupply, balanceOwner);
    });

    it('verification of receiving Ether', async ()  => {
        var tokenAllocatedBefore = await contract.tokenAllocated.call();
        var balanceAccountTwoBefore = await contract.balanceOf(accounts[2]);
        var weiRaisedBefore = await contract.weiRaised.call();
        //console.log("tokenAllocatedBefore = " + tokenAllocatedBefore);

        var numberToken = await contract.validPurchaseTokens.call(Number(buyWei));
        //console.log(" numberTokens = " + JSON.stringify(numberToken));
        //console.log("numberTokens = " + numberToken);

        period = await contract.getPeriod.call(tokenAllocatedBefore);
        //console.log("period = " + period)

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

    it('verification define period', async ()  => {
        period = await contract.getPeriod(1*10**23);
        //console.log("period = " + period);
        assert.equal(0, period);

        period = await contract.getPeriod(5*10**24);
        assert.equal(1, period);

        period = await contract.getPeriod(10*10**24);
        assert.equal(2, period);

        period = await contract.getPeriod(15*10**24);
        assert.equal(3, period);

        period = await contract.getPeriod(20*10**24);
        assert.equal(4, period);

        period = await contract.getPeriod(26*10**24);
        assert.equal(5, period);

        period = await contract.getPeriod(31*10**24);
        assert.equal(6, period);
    });

    it('verification valid purchase token', async ()  => {
        var newByWei = 1 * 10**17;
        var numberToken = await contract.validPurchaseTokens.call(Number(newByWei));
        assert.equal( newByWei*4000, numberToken);
        //console.log("numberToken = " + numberToken);

        var tokenAllocatedBefore = await contract.tokenAllocated.call();
        //console.log("tokenAllocatedBefore = " + tokenAllocatedBefore);
        newByWei = 6 * 10**18;
        numberToken = await contract.validPurchaseTokens.call(Number(newByWei));
        await contract.buyTokens(accounts[3],{from:accounts[3], value:newByWei});
        var tokenAllocated = await contract.tokenAllocated.call();
        //console.log("tokenAllocated = " + tokenAllocated);
        assert.equal( newByWei*4000*1.2, numberToken);
        //assert.equal(Number(tokenAllocatedBefore) < Number(tokenAllocated));
    });

    it('verification tokens limit min amount', async ()  => {
            var numberTokensMinWey = await contract.validPurchaseTokens.call(buyWeiMin);
            //console.log("numberTokensMinWey = " + numberTokensMinWey);
            assert.equal(0, numberTokensMinWey);
    });

    it('verification tokens cap reached', async ()  => {
            var numberTokensNormal = await contract.validPurchaseTokens.call(buyWei);
            //console.log("numberTokensNormal = " + numberTokensNormal);
            assert.equal(rate*buyWei, numberTokensNormal);

            var numberTokensFault = await contract.validPurchaseTokens.call(buyWeiCap);
            //console.log("numberTokensFault = " + numberTokensFault);
            assert.equal(0, numberTokensFault);
    });

});



