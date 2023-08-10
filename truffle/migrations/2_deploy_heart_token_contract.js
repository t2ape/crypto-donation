require('dotenv').config({ path: '../.env' });

const HeartToken = artifacts.require("HeartToken");

const founders = process.env.FOUNDERS_ADDRESS;
if (!founders) {
  throw new Error("founders is not set");
}

const proxyRegistry = process.env.PROXY_REGISTRY_ADDRESS;
if (!proxyRegistry) {
  throw new Error("proxyRegistry is not set");
}

module.exports = async function (deployer) {
  await deployer.deploy(HeartToken, founders, proxyRegistry);
};
