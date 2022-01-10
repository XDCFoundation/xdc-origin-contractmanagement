


/**
 * @title ERC20Detailed token
 * @dev The decimals are only for visualization purposes.
 * All the operations are done using the smallest and indivisible token unit,
 * just as on Ethereum all the operations are done in wei.
 */
abstract contract ERC20Detailed is IERC20 {
  string private _name;
  string private _symbol;
  uint8 private _decimals;

  constructor(string memory name1, string memory symbol1, uint8 decimals1) public {
    _name = name1;
    _symbol = symbol1;
    _decimals = decimals1;
  }

  /**
   * @return the name of the token.
   */
  function name() public view returns(string memory) {
    return _name;
  }

  /**
   * @return the symbol of the token.
   */
  function symbol() public view returns(string memory) {
    return _symbol;
  }

  /**
   * @return the number of decimals of the token.
   */
  function decimals() public view returns(uint8) {
    return _decimals;
  }
}
