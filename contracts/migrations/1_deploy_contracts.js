const ERC20 = artifacts.require("ERC20");
const Dumpling = artifacts.require("Dumpling");

const tokenName = "TT";
const tokenSymbol = "TT";
const tokenDecimals = "18";
const tokenTotalSupply = "1000000000000000000000000000";

module.exports = async function(deployer) {
  deployer.then(async () => {
    let erc20 = await deployer.deploy(ERC20, tokenName, tokenTotalSupply);
    let dumpling = await deployer.deploy(Dumpling, erc20._address);
  });
};
