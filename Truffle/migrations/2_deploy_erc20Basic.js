const ERC20Basic = artifacts.require("ERC20Basic");

module.exports = async (deployer) => {
  await deployer.deploy(ERC20Basic, "Betting Game Token", "BET");
};
