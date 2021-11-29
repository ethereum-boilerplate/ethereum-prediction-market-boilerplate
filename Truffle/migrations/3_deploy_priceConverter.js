const PriceConverter = artifacts.require("PriceConverter");

module.exports = async (deployer) => {
  await deployer.deploy(PriceConverter);
};
