pragma solidity ^0.4.24;

contract Test1 {

  uint public number_;

  constructor(uint _defaultNumber) public {
    number_ = _defaultNumber;
  }

  function setNumber(uint _number) public {
    number_ = _number;
  }

  function getNumber() public view returns (uint number) {
    return number_;
  }

}
