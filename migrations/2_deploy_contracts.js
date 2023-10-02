const RandomHashGenerator = artifacts.require("RandomHashGenerator");

module.exports = function (deployer) {
  deployer.deploy(RandomHashGenerator);
};
