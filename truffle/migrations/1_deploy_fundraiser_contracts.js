const FundraiserStorage = artifacts.require('FundraiserStorage');
const AdministratorFundraiserHandler = artifacts.require('AdministratorFundraiserHandler');
const UserFundraiserHandler = artifacts.require('UserFundraiserHandler');

module.exports = async function (deployer) {
  await deployer.deploy(FundraiserStorage);
  const fundraiserStorageInstance = await FundraiserStorage.deployed();

  await deployer.deploy(AdministratorFundraiserHandler, fundraiserStorageInstance.address);
  const adminFundraiserHandlerInstance = await AdministratorFundraiserHandler.deployed();

  await deployer.deploy(UserFundraiserHandler, fundraiserStorageInstance.address);
  const userFundraiserHandlerInstance = await UserFundraiserHandler.deployed();

  await fundraiserStorageInstance.addAccessPermittedContract(adminFundraiserHandlerInstance.address);
  await fundraiserStorageInstance.addAccessPermittedContract(userFundraiserHandlerInstance.address);
};
