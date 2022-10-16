pragma solidity ^0.4.17;
// linter warnings (red underline) about pragma version can igonored!
// contract code will go here
// SPDX-License-Identifier: GPL-3.0


contract Inbox {

    // Instance Variable (Global)
    string public message;
    
    constructor(string initialMessage) public {
        message = initialMessage;
    }

    function setMessage(string newMessage) public {
        message = newMessage;
    }

    function doMath(int a, int b) {
        a-b;
    }
}


