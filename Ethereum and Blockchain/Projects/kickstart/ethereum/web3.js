import Web3 from "web3"; 


let web3;
if(typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    // We are in the browser hence metamask is running
    web3 = new Web3(window.web3.currentProvider);
}
else{
    // We are on the server or the user is not running metamask
    const provider = new Web3.providers.HttpProvider(
    'https://goerli.infura.io/v3/fbcc2b49fb4f4b72ac43ee551afab6ea'
    );
    web3 = new Web3(provider);
}
// window.ethereum.request({ method: "eth_requestAcc ounts" });
// const web3 = new Web3(window.ethereum);

export default web3;