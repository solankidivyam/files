// One single test file for two contracts..

const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const web3 = new Web3(ganache.provider());

// Getting the factory contract
const compiledFactory = require('../ethereum/build/Factory.json');
const compiledContract = require('../ethereum/build/Campaign.json');


// Storing accounts

let accounts;
let factory;

// Storing the address of the deployed contract
let campaignAddress;
let campaign;

beforeEach(async () => {   
    accounts = await web3.eth.getAccounts();
    // Deploying the factor
    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send({ from: accounts[0], gas: '1000000' });

    // Minimum contribution taken in createCampaign function
    await factory.methods.createCampaign('100').send({
        from: accounts[0],
        gas: '1000000'
    });

    // Get the address of the deployed contract
    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

    // Get the instance of the deployed contract
    campaign = await new web3.eth.Contract(
        // ABI
        JSON.parse(compiledContract.interface),
        campaignAddress
    );
});

describe('Campaigns', () => {
    it('deploys a factory and a campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    // Check if the manager is the one who deployed the contract
    it('marks caller as the campaign manager', async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0], manager);
    });

    // Check if the contribution is greater than the minimum contribution
    it('allows people to contribute money and marks them as approvers', async () => {
        await campaign.methods.contribute().send({
            value: '200',
            // Contributor
            from: accounts[1]
        });
        const isContributor = await campaign.methods.approvers(accounts[1]).call();
        assert(isContributor);
    });

    // Check if the minimum contribution is met

    it('requires a minimum contribution', async () => {

        try {
            await campaign.methods.contribute().send({
                value: '5',
                from: accounts[1]
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('allows a manager to make a payment request', async () => {
        await campaign.methods
            .createRequest('Buy batteries', '100', accounts[1])
            .send({
                from: accounts[0],
                gas: '1000000'
            });
        const request = await campaign.methods.requests(0).call();

        assert.equal('Buy batteries', request.description);
    });

    it(`processes requests`, async () => {
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
        });

        await campaign.methods
            .createRequest('A', web3.utils.toWei('5', 'ether'), accounts[1])
            .send({ from: accounts[0], gas: '1000000' });

        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        let balance = await web3.eth.getBalance(accounts[1]);
        balance = web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);

        console.log(balance);
        assert(balance > 104);
    });

    it("doesn't allow a request to be finalized if it's not approved", async () => {

        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
        });

        await campaign.methods
            .createRequest('A', web3.utils.toWei('5', 'ether'), accounts[1])
            .send({ from: accounts[0], gas: '1000000' });

        try {
            await campaign.methods.finalizeRequest(0).send({
                from: accounts[0],
                gas: '1000000'
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });







    
});

