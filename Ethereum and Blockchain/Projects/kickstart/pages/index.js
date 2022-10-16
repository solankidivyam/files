import React, { Component } from 'react';
// Importing factory

import factory from '../ethereum/factory';



// Class based component
class CampaignInstance extends Component {
    async componentDidMount() {
        // Retreives an array of all adressess of deployed campaigns
        const campaigns = await factory.methods.getDeployedCampaigns().call();

        console.log(campaigns);
    }



    render() {
        return <h1>CampaignInstance</h1>;
    }
}


// We need to export a component here 
export default CampaignInstance;






// export default () => {
//     return(
//         <h1>New Campaign</h1>
//     );
// }