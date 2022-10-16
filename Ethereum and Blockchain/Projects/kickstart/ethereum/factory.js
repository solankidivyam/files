import web3 from './web3';
import CampaignFactory from './build/Factory.json';

// Preconfigured instance of the contract

// Instance where we have already deployed our contract

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0x67889AAB13100Bf2b783bcBcdafFFF0E5CcF436a'
);

export default instance;
