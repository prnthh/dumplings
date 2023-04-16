var ERC20Mock = artifacts.require("ERC20Mock");
var Dumpling = artifacts.require("Dumpling");

const BORROW_ADDR="0x627306090abaB3A6e1400e9345bC60c78a8BEf57";

module.exports = async function (deployer) {
  deployer.then(async () => {
    let token = await deployer.deploy(ERC20Mock);
    let dumpling = await deployer.deploy(Dumpling, token.address, BORROW_ADDR);
  });
};
