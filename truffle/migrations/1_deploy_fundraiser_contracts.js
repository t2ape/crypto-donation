const FundraiserStorage = artifacts.require('FundraiserStorage');
const AdminFundraiserLogic = artifacts.require('AdminFundraiserLogic');
const UserFundraiserLogic = artifacts.require('UserFundraiserLogic');

module.exports = function (deployer) {
  deployer.deploy(FundraiserStorage)
    .then(() => {
      return deployer.deploy(AdminFundraiserLogic, FundraiserStorage.address);
    })
    .then(() => {
      return deployer.deploy(UserFundraiserLogic, FundraiserStorage.address);
    });
};
