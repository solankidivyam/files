// Testing the Lottery.sol Contract

const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

// Provider is what allows us to interact with any given contract to the test network
// `ganache.provider()` is a function that returns a provider
const web3 = new Web3(ganache.provider());

const { interface, bytecode } = require('../compile');

let lottery;
let accounts;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    
    lottery = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode })
        // The first account is sending
        .send({ from: accounts[0], gas: '1000000' });
});

describe('Lottery Contract', () => {
    it('deploys a contract', () => {
        // Check if the address is defined
        // The Address on which the contract is deployed to
        assert.ok(lottery.options.address);
    });


    // Single Entry
    it('allows one account to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.01', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        // Checking if the correct address is added to the players array
        assert.equal(accounts[0], players[0]);

        // Checking if the players array has only one entry
        assert.equal(1, players.length);
    });

    // Multiple Entries
    it('allows multiple accounts to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });

        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.02', 'ether')
        });

        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('0.02', 'ether')
        });

        await lottery.methods.enter().send({
            from: accounts[3],
            value: web3.utils.toWei('0.02', 'ether')
        });


        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        // Checking if the correct address is added to the players array
        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);
        assert.equal(accounts[3], players[3]);

        // Checking if the players array has correct number of entries
        // This is where we are testing the code for the correct output
        assert.equal(4, players.length);
    });

    // Minimum Entry
    it('requires a minimum amount of ether to enter', async () => {
        try {
            await lottery.methods.enter().send({
                from: accounts[0],
                value: 0
            });
            assert(false); // This statement not run since the try block will throw an error and go directly to catch
        } catch (err) {
            assert(err);
        }
    });

    it('only manager can call pickWinner', async () => {
        try {
            await lottery.methods.pickWinner().send({
                from: accounts[1]
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('Sends money to the winner and resets our players array', async () => {

        // Only one player is entered so that we would be able to test the code
        // Not testing the random function
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('2', 'ether')
        });

        const initialBalance = await web3.eth.getBalance(accounts[0]);
        await lottery.methods.pickWinner().send({ 
            from: accounts[0] 
        });
        const finalBalance = await web3.eth.getBalance(accounts[0]);
        const difference = finalBalance - initialBalance;
        // We would need to give some amount of money in GAS to the network
        assert(difference > web3.utils.toWei('1.9', 'ether'));

        // Checking if the players array is reset
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });
        assert.equal(0, players.length);

        // Checking if the contract balance is reset
        const balance = await web3.eth.getBalance(lottery.options.address);
        assert.equal(0, balance);

    });
});