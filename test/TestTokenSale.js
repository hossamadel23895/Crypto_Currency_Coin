var TestToken = artifacts.require("./TestToken.sol");
var TestTokenSale = artifacts.require("./TestTokenSale.sol");

contract("TestTokenSale", function (accounts) {
  var token;
  var tokenSale;
  var tokenPrice = 1000000000000000; // in wei == 0.001 eth
  var tokenAvailableForSale = 750000;
  var higherThanAvailable = 800000;
  var admin = accounts[0];
  var buyer = accounts[1];

  it("Initialize the contract with the correct values", async function () {
    token = await TestToken.deployed();
    tokenSale = await TestTokenSale.deployed();
    assert.notEqual(tokenSale.address, 0x0, "Has contract address");

    salesTransferReceipt = await token.transfer(
      tokenSale.address,
      tokenAvailableForSale,
      { from: admin }
    );

    contract = await tokenSale.tokenContract();
    assert.notEqual(
      tokenSale.tokenContract(),
      0x0,
      "Has token contract address"
    );

    price = await tokenSale.tokenPrice();
    assert.equal(price, tokenPrice, "Token price is correct");
  });

  it("Facilitates token buying", async function () {
    let numberOfTokens = 10;

    let receipt = await tokenSale.buyTokens(numberOfTokens, {
      from: buyer,
      value: numberOfTokens * tokenPrice,
    });
    assert.equal(receipt.logs.length, 1, "triggers one event");
    assert.equal(receipt.logs[0].event, "Sell", 'should be the "Sell" event');
    assert.equal(
      receipt.logs[0].args._buyer,
      buyer,
      "logs the account that purchased the tokens"
    );
    assert.equal(
      receipt.logs[0].args._amount,
      numberOfTokens,
      "logs the amount of tokens purchased"
    );

    let amount = await tokenSale.tokensSold();
    assert.equal(
      amount.toNumber(),
      numberOfTokens,
      "increments the number of tokens sold"
    );

    try {
      failReceipt = await tokenSale.buyTokens(numberOfTokens, {
        from: buyer,
        value: 1,
      });
      assert.fail();
    } catch (error) {
      assert(
        error.message.indexOf("revert") >= 0,
        "msg.value must equal number of tokens in wei"
      );
    }

    try {
      failReceipt2 = await tokenSale.buyTokens(higherThanAvailable, {
        from: buyer,
        value: higherThanAvailable * tokenPrice,
      });
      assert.fail();
    } catch (error) {
      assert(
        error.message.indexOf("insufficient") >= 0,
        "required amount can not be higher that the available amount"+error.message
      );
    }
  });

  it("Ends token sale", async function () {
    try {
      let failedEnd = await tokenSale.endSale({ from: buyer });
      assert.fail();
    } catch (error) {
      assert(
        error.message.indexOf("revert") >= 0,
        "Must be admin to end the sale"
      );
    }

    let adminEnd = await tokenSale.endSale({ from: admin });
    let adminBalance = await token.balanceOf(admin);
    assert.equal(
      adminBalance.toNumber(),
      999990,
      "returns all unsold tokens to admin"
    );
  });
});
