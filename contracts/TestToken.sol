pragma solidity ^0.8.17;

contract TestToken {
	// making our variables public gives us free getter with the same name. ex: token.totalSupply()
	// calls on the token variables are async so we use promises for it.
	// ex : token.totalSupply().then(function(s) { totalSupply = s;});
    uint256 public totalSupply;

    constructor() {
        totalSupply = 1000000;
    }


}
