x// deploy code will go here

// Take some code and deploy it to an Ethereum Network...

const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
    'risk suffer grit egg digital awake leg cloth treat repeat cost liar',
    'https://goerli.infura.io/v3/fbcc2b49fb4f4b72ac43ee551afab6ea'
);

// New Instance of web3 to interact with the network and select the specific provider

const web3 = new Web3(provider);


const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account', accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: ['Hi there!'] })
        .send({ gas: '1000000', from: accounts[0] });

    console.log('Contract deployed to', result.options.address); 
    provider.engine.stop();
}
// Call the deploy function
deploy();



// beforeEach(async () => {
//     accounts = await web3.eth.getAccounts();

//     inbox = await new web3.eth.Contract(JSON.parse(interface))
//         .deploy({ data: bytecode, arguments: ['Hi there!'] })
//         .send({ from: accounts[0], gas: '1000000' });
// });


// describe('Inbox', () => {
//     it('deploys a contract', () => {
//         assert.ok(inbox.options.address);
//     });

//     it('has a default message', async () => {
//         const message = await inbox.methods.message().call();
//         assert.equal(message, 'Hi there!');
//     });

//     it('can change the message', async () => {
//         await inbox.methods.setMessage('bye').send({ from: accounts[0] });
//         const message = await inbox.methods.message().call();
//         assert.equal(message, 'bye');
//     });
// }
