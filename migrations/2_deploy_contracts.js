var TestToken = artifacts.require("./TestToken.sol");
var TestTokenSale = artifacts.require("./TestTokenSale.sol");

module.exports = async function(deployer){
	let tokenPrice = 1000000000000000; // in wei == 0.001 eth
	let token = await deployer.deploy(TestToken, 1000000);
	let tokenSale = await deployer.deploy(TestTokenSale, TestToken.address, tokenPrice);
}