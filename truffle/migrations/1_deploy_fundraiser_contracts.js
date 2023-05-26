const FundraiserStorage = artifacts.require('FundraiserStorage');
const AdminFundraiserLogic = artifacts.require('AdminFundraiserLogic');
const UserFundraiserHandler = artifacts.require('UserFundraiserHandler');

module.exports = function (deployer) {
  deployer.deploy(FundraiserStorage)
    .then(() => {
      return deployer.deploy(AdminFundraiserLogic, FundraiserStorage.address);
    })
    .then(() => {
      return deployer.deploy(UserFundraiserHandler, FundraiserStorage.address);
    });
};
