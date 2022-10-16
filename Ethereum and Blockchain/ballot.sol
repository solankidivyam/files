// SPDX-License-Identifier: GPL-3.0


// Try Remix for the Deployment and testing
pragma solidity >=0.4.16 <0.9.0;

contract Inbox {

    // Instance Variable (Global)
    string public message;
    
    constructor(string initialMessage) public {
        message = initialMessage;
    }

    function setMessage(string newMessage) public {
        message = newMessage;
    }

    function getMessage() public view returns (string){
        return message;
    }

}