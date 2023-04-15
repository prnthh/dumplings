var Dumpling = artifacts.require("Dumpling");

module.exports = async function (deployer) {
  deployer.then(async () => {
    let dumpling = await deployer.deploy(Dumpling);
  });
};
