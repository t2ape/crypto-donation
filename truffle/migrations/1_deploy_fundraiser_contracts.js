const FundraiserStorage = artifacts.require('FundraiserStorage');
const AdministratorFundraiserHandler = artifacts.require('AdministratorFundraiserHandler');
const UserFundraiserHandler = artifacts.require('UserFundraiserHandler');

module.exports = function (deployer) {
  deployer.deploy(FundraiserStorage)
    .then(() => {
      return deployer.deploy(AdministratorFundraiserHandler, FundraiserStorage.address);
    })
    .then(() => {
      return deployer.deploy(UserFundraiserHandler, FundraiserStorage.address);
    });
};
