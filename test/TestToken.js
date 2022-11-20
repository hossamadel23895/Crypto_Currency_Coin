var TestToken = artifacts.require("./TestToken.sol");

contract("TestToken", function (accounts) {
  it("Test Initial supply", async function () {
    token = await TestToken.deployed();
    totalSupply = await token.totalSupply();
    adminBalance = await token.balanceOf(accounts[0]);

    // assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to 1,000,000');

    assert.equal(
      adminBalance.toNumber(),
      1000000,
      "it allocates the initial supply to the admin acocunt"
    );
  });

  it("Test Name", async function () {
    token = await TestToken.deployed();
    tokenName = await token.name();
    assert.equal(tokenName, "Test Token", "Has the correct name");
  });

  it("Test Symbol", async function () {
    token = await TestToken.deployed();
    tokenSymbol = await token.symbol();
    assert.equal(tokenSymbol, "TST", "Has the correct symbol");
  });

  it("Test Standard", async function () {
    token = await TestToken.deployed();
    tokenStandard = await token.standard();
    assert.equal(tokenSymbol, "TST", "Has the correct standard");
  });

  it("Transfer tests", async function () {
    token = await TestToken.deployed();

    receipt = await token.transfer(accounts[1], 250000, { from: accounts[0] });
    assert.equal(receipt.logs.length, 1, "triggers one event");
    assert.equal(receipt.logs[0].event, "Transfer", 'should be the "Transfer" event');
	assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account the tokens are transferred from');
	assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the account the tokens are transferred to');
	assert.equal(receipt.logs[0].args._value, 250000, 'logs the transfer amount');
    receiverBalance = await token.balanceOf(accounts[1]);
    assert.equal(
      receiverBalance.toNumber(),
      250000,
      "it added the amount to the receiving account"
    );
  });

  it("Approve tokens for delegated transfer", async function () {
	token = await TestToken.deployed();

	approveResponse = await token.approve.call(accounts[1], 100);
	assert.equal(approveResponse, true, 'it returns true');

	receipt = await token.approve(accounts[1], 100, {from: accounts[0]});
	assert.equal(approveResponse, true, 'it returns true');
	assert.equal(receipt.logs.length, 1, "triggers one event");
	assert.equal(receipt.logs[0].event, "Approval", 'should be the "Approval" event');
	assert.equal(receipt.logs[0].args._owner, accounts[0], 'logs the account the tokens are authorized by');
	assert.equal(receipt.logs[0].args._spender, accounts[1], 'logs the account the tokens are authorized to');
	assert.equal(receipt.logs[0].args._value, 100, 'logs the transfer amount');

	allowance = await token.allowance(accounts[0], accounts[1]);
	assert.equal(allowance, 100, 'stores the allowance for delegated transfer');
  });
});
