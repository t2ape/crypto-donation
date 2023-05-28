const FundraiserStorage = artifacts.require('FundraiserStorage');
const AdministratorFundraiserHandler = artifacts.require('AdministratorFundraiserHandler');
const UserFundraiserHandler = artifacts.require('UserFundraiserHandler');

module.exports = function (deployer) {
  deployer.deploy(FundraiserStorage).then(async () => {
    const fundraiserStorageInstance = await FundraiserStorage.deployed();

    deployer.deploy(AdministratorFundraiserHandler, fundraiserStorageInstance.address).then(async () => {
      const adminFundraiserHandlerInstance = await AdministratorFundraiserHandler.deployed();

      deployer.deploy(UserFundraiserHandler, fundraiserStorageInstance.address).then(async () => {
        const userFundraiserHandlerInstance = await UserFundraiserHandler.deployed();

        await fundraiserStorageInstance.setAccessPermittedContract(adminFundraiserHandlerInstance.address);

        await fundraiserStorageInstance.setAccessPermittedContract(userFundraiserHandlerInstance.address);
      });
    });
  });
};
