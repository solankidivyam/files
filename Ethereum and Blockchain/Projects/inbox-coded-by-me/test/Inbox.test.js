// contract test code will go here
// SIMPLE TEST

// Used in the assertion of the tests   
const assert = require('assert');

// Local Test Network
const ganache = require('ganache-cli');

// We will be using a constructor Function (Capitalized) to create instances of the contract
const Web3 = require('web3');


// Lowercase means the instance of the contructor
// Creates an instaces of Web3 and connects it to the local test network
const web3 = new Web3(ganache.provider());

const {interface, bytecode} = require('../compile');

// Mocha is a testing framework


let accounts;
let inbox;
const INITIAL_MESSAGE = "Hi there!";

beforeEach(async () => {
    // Get a list of all accounts
    // We use one of the test accounts to deploy onto a network and test it out.
    
    // We are using 'eth' MODULE 
    // Basically printing the fecthed accounts

    // 10 Seperated accounts

    // Using a promise
    accounts = await web3.eth.getAccounts()


    // We have to pass in the initialMessage that we defined in our contract

    // Arguments are the things that will be passed into the constructor function

    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode, arguments: [INITIAL_MESSAGE]})
        // We have to assign some gas for every transaction
        .send({from: accounts[0], gas: '1000000'})

        // Send method is used to send a transaction to the network
        // .deploy does not do anything on the network
        // .send actually sends the transaction to the network




    // .then(fetchedAccounts => {
    //     console.log(fetchedAccounts);
    // });
    // We can use async await
    // Using one of those accounts to contract

});

describe('Inbox', () => {
    it('deploys a contract', () => {
        // console.log(inbox);
        // This contains the address of the test network account where the contract is deployed
        // assert -> Node Standard Library
        assert.ok(inbox.options.address);
    });

    it('Checking the message', async () => {
        // We are using the 'methods' module
        // We are calling the 'call' method on the 'message' method on the 'methods' module
        const message = await inbox.methods.message().call();
        assert.equal(message, INITIAL_MESSAGE);
    });

    // Modifying the message
    // With the help of setMessage method

    it('Modifying the message', async () => {
        //.send() is used to send a transaction to the network
        // We don't assign the transaction to a variable because we don't need to use it
        // If something goes wrong then an error will be thrown

        await inbox.methods.setMessage('Bye').send({from: accounts[0]});
        const message = await inbox.methods.message().call();
        assert.equal(message, 'Bye');
    });
});
    








// class Car {
//     park() {
//         return 'stopped';
//     }
//     drive() {
//         return 'vroom';
//     }


// }

// // To make a variable that can be used in the it functions
// let car;

// beforeEach(() => {
//     // console.log('Before Each');
//     car = new Car();
// });

// // Using Arrow Function
// // We can group together multiple it functions
// describe('Car', () => {
//     it('can park', () => {
//         // const car = new Car();
//         // Checking that what it should be equal to what it is
//         assert.equal(car.park(), 'stopped');
//     });

//     it('can drive', () => {
//         // const car = new Car();
//         assert.equal(car.drive(), 'vroom');
//     });
// });