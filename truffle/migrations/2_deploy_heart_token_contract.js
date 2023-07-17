const HeartToken = artifacts.require('HeartToken');
// TODO: 本番デプロイ時に修正
const founders = '0xC269Bf93B4ed3D561Df78Dc23c4E8518604887A9';

module.exports = async function (deployer) {
  //  TODO: opensea について調べたら proxyRegistry を用いる形に修正
  await deployer.deploy(HeartToken, founders);
};
