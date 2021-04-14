pragma solidity ^0.5.16;

contract Test2 {

  uint public number_;

  constructor() public { }

  function setNumber(uint _number) public {
    number_ = _number;
  }

  function getNumber() public view returns (uint number) {
    return number_;
  }

  function getNumberArg(uint arg) public view returns (uint number) {
    return arg;
  }

}
