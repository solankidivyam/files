// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.4.17 ;


contract Factory {
    address[] public deployedCampaigns;

    function createCampaign(uint mini) public {
        // So this right here deploys a new contract that takes mini as the minimum requirement by the Campaign Contract
        address newCampaign = new Campaign(mini, msg.sender);
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[]){
        // Gives us the Campaign addressed
        return deployedCampaigns;
    }
}

contract Campaign {

    // This is just a Struct definition
    // This does not creates an instance of the struct in any way
    // Just creates a type (an idea)
    struct Request {
        string description;
        uint value;
        address recipient;
        bool completed;

        // How to implement the voting Mechanism
        uint approvalCount;
        mapping(address => bool) approvals;

    }

    // Storage : Just like a Hardrive, long term
    // Just behaves like an array
    Request[] public requests;
    address public manager;
    uint public minimumContribution;

    // We should use a mapping
    // address[] public approvers;

    mapping(address => bool) public approvers;
    uint public contributersCount;
    // Defined the manager and gave the user an option to choose the minimum requirement of the money

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    // mini is a MEMORY DATA
    constructor(uint mini, address creator) public{
        manager = creator;
        minimumContribution = mini;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);

        // approvers.push(msg.sender);
        approvers[msg.sender] = true;
        contributersCount++;
        
    }



    // Only manager able to make a request
    // Basically creates a spending request

    // We would need the manager to state the requirements of the spending requests
    // Take them as parameters
    function createRequest(string description, uint value, address recipient) 
        public  restricted {
        // Creating an instance
        // A key : value approach

        // The 'storage' keyword changes how the new variable is now declared
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            completed: false,
            approvalCount: 0

            // Not initialised the approvals field (mapping) 
        });

        // Don't use easy syntax : BAD PRACTICE
        // Request(description, value, recipient, false);
        
        // Now pushing the newly created Request into our Request type array
        requests.push(newRequest);
    }

    function approveRequest(uint index) public {

        // LOCAL VARIABLE
        Request storage request = requests[index];

        // Checking if the person has already contributed
        // if yes then he/she would be included in the approvers mapping
        require(approvers[msg.sender]);

        // If the person has already voted then this would return as true since it has registered the vote already
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;

    }
    function finalizeRequest(uint index) public restricted {
        Request storage request0 = requests[index];
        // Whenever a request has been finalized we will make the completed variable as true/
        require(!request0.completed);
        require(request0.approvalCount > contributersCount / 2);

        // Sending all the money to the VENDOR
        request0.recipient.transfer(request0.value);
        request0.completed = true;

        // When atleast more than 50% people approve the request then only the request would be finalized


    }
}

// pragma solidity ^0.4.17;

// contract CampaignFactory {
//     address[] public deployedCampaigns;

//     function createCampaign(uint minimum) public {
//         address newCampaign = new Campaign(minimum, msg.sender);
//         deployedCampaigns.push(newCampaign);
//     }

//     function getDeployedCampaigns() public view returns (address[]) {
//         return deployedCampaigns;
//     }
// }

// contract Campaign {
//     struct Request {
//         string description;
//         uint value;
//         address recipient;
//         bool complete;
//         uint approvalCount;
//         mapping(address => bool) approvals;
//     }

//     Request[] public requests;
//     address public manager;
//     uint public minimumContribution;
//     mapping(address => bool) public approvers;
//     uint public approversCount;

//     modifier restricted() {
//         require(msg.sender == manager);
//         _;
//     }

//     function Campaign(uint minimum, address creator) public {
//         manager = creator;
//         minimumContribution = minimum;
//     }

//     function contribute() public payable {
//         require(msg.value > minimumContribution);

//         approvers[msg.sender] = true;
//         approversCount++;
//     }

//     function createRequest(string description, uint value, address recipient) public restricted {
//         Request memory newRequest = Request({
//            description: description,
//            value: value,
//            recipient: recipient,
//            complete: false,
//            approvalCount: 0
//         });

//         requests.push(newRequest);
//     }

//     function approveRequest(uint index) public {
//         Request storage request = requests[index];

//         require(approvers[msg.sender]);
//         require(!request.approvals[msg.sender]);

//         request.approvals[msg.sender] = true;
//         request.approvalCount++;
//     }

//     function finalizeRequest(uint index) public restricted {
//         Request storage request = requests[index];

//         require(request.approvalCount > (approversCount / 2));
//         require(!request.complete);

//         request.recipient.transfer(request.value);
//         request.complete = true;
//     }
// }