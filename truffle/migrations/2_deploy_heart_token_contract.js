const HeartToken = artifacts.require('HeartToken');
// TODO: 本番デプロイ時に修正
const founders = '0x031a4282d3ae8617a2df9bef5088c0a38f12c0bd';

module.exports = async function (deployer) {
  //  TODO: opensea について調べたら proxyRegistry を用いる形に修正
  await deployer.deploy(HeartToken, founders);
};
