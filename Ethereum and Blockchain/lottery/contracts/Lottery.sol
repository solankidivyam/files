pragma solidity ^0.4.17;

contract Lottery {
    address public manager;
    address[] public players;
    
    function Lottery() public {
        manager = msg.sender;
    }
    
    function enter() public payable {
        require(msg.value >= .01 ether);
        players.push(msg.sender);
    }
    
    function random() private view returns (uint) {
        return uint(keccak256(block.difficulty, now, players));
    }
    
    function pickWinner() public restricted {
        uint index = random() % players.length;
        players[index].transfer(this.balance);
        lastWinner = players[index];
        players = new address[](0);
    }
    
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    
    function getPlayers() public view returns (address[]) {
        return players;
    }
}   


// Updated version : 

// SPDX-License-Identifier: GPL-3.0

// pragma solidity >=0.7.0 <0.9.0;

// /** 
//  * @title Ballot
//  * @dev Implements voting process along with vote delegation
//  */
// contract Lottery {

//     address payable public manager;
//     // Dynamic Array
//     address payable[] public players;

//     // Enter Function
//     // When someone is calling this function theh might send some of the ether along with it. 'payable'

//     // Enter Method
//     function enterInLottery() public payable {
//         // Require is used for validation, we can pass some boolean expression 
//         // If false then it will not run subsequent code
//         // If returned true then it will continue to work as usual
//         require(msg.value > 0.01 ether);
//         // players.push(msg.sender);
//         players.push(payable(msg.sender));
//     }

//     // Pseudo-random generator
//     // function pickPlayer() private view returns (uint) {
//     //     return uint(keccak256(block.difficulty, block.timestamp, players));

//     // }

//      uint256 public randNonce;

//     // It's really a pseudo random
//     function random() private view returns(uint) {
//         // randNonce = uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
//         // return randNonce;
//         return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
//     }

//     function pickPlayer() public restricted {
//         // Pick Player is working as we are expecting it to be

//         uint index = random() % players.length;
//         players[index].transfer(address(this).balance);  // This will be an address of the winner
//         players = new address payable[](0);


//     }

//     // function returnEntries() public{

//     // }

//     // Helps with the non repetition of the code in the functions
//     modifier restricted(){
//         require(msg.sender == manager);
//         _;
//     }
//     constructor() {
//         manager = payable(msg.sender);
//     }

//     function allPlayers() public view returns (address payable[] memory){
//         return players;
//     }


// }