import { Wallet, HDNodeWallet } from 'ethers';

// 1. Create random wallet to get a mnemonic
const randomWallet = Wallet.createRandom();
// const mnemonic = randomWallet.mnemonic.phrase;
const mnemonic = "start oxygen chest tiger genre own pull inspire battle flip culture update"
console.log('Mnemonic:', mnemonic);

// 2. Build the master HDNode from phrase
const masterNode = HDNodeWallet.fromPhrase(mnemonic);
console.log('Master xpub:', masterNode.extendedKey);


// Derive index 0
const node0 = masterNode.derivePath("44'/60'/0'/0/0");
console.log('Address[0]:', node0.address);
console.log('Public[0]:', node0.publicKey);
console.log('Private[0]:', node0.privateKey);


// Derive index 1
const node1 = masterNode.derivePath("44'/60'/0'/0/1");
console.log('Address[1]:', node1.address);
console.log('Public[1]:', node1.publicKey);
console.log('Private[1]:', node1.privateKey);


// Batch derive first 5 addresses
const wallets = [];
for (let i = 0; i < 5; i++) {
    const child = masterNode.derivePath(`44'/60'/0'/0/${i}`);
    wallets.push(new Wallet(child.privateKey));
}

console.log("++++++++++++++++++++++++++++++++++++++++++++")
console.log("============================================")

wallets.map((w, index) => {
    console.log(`Address[${index}]:`, w.address);
    console.log(`Private[${index}]:`, w.privateKey);
});




function getUserNode(masterNode, userId) {
  // Derive user-specific account: m/44'/60'/<userId>'
  return masterNode.derivePath(`44'/60'/${userId}'`);
}

function getDepositWallet(userNode, depositIndex) {
  // Under that account, derive external chain / index: m/.../0/<depositIndex>
  const addrNode = userNode.derivePath(`0/${depositIndex}`);
  return new Wallet(addrNode.privateKey);
}


async function topUpChild(childAddr, amountEth = "0.01") {
  const tx = await masterWallet.sendTransaction({
    to: childAddr,
    value: ethers.parseEther(amountEth),
    // optional: set gasPrice, gasLimit
  });
  await tx.wait();
  console.log(`Sent ${amountEth} ETH to ${childAddr}`);
}


// Example for user 123:

console.log("====================================================")
const userNode = getUserNode(masterNode, 0);
const depA = getDepositWallet(userNode, 0);
const depB = getDepositWallet(userNode, 1);
console.log('Deposit addresses:', depA.address, depB.address);