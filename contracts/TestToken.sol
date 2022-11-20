pragma solidity ^0.8.17;

contract TestToken {
    // making our variables public gives us free getter with the same name. ex: token.totalSupply()
    // calls on the token variables are async so we use promises for it.
    // ex : token.totalSupply().then(function(s) { totalSupply = s;});
    string public name = "Test Token";

    string public symbol = "TST";

    string public standard = "Test Token v1.0";

    uint256 public totalSupply;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    mapping(address => uint256) public balanceOf;

    mapping(address => mapping(address => uint256)) public allowance;

    constructor(uint256 _initialSupply) {
        // msg.sender comes from the metadata of solidity
        // allocate the initial supply
        balanceOf[msg.sender] = _initialSupply;

        totalSupply = _initialSupply;
    }

    function transfer(address _to, uint256 _value)
        public
        returns (bool success)
    {
        // check if the balance of the sender is higher than the transfer value to continue
        // *require => if condition is true continue else throw exception
        require(balanceOf[msg.sender] >= _value);

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

		emit Transfer(msg.sender, _to, _value);
		
		return true;
    }

	// Delegate transfer
	 function approve(address _spender, uint256 _value) public returns (bool success) {
		allowance[msg.sender][_spender] = _value;

		emit Approval(msg.sender, _spender, _value);

		return true;
	 }
}
