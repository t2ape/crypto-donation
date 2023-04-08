const {toBN} = require("web3-utils");

const FundraiserFactoryContract = artifacts.require("FundraiserFactory");

contract("FundraiserFactory のデプロイを確認", () => {
  it("FundraiserFactory をデプロイできること", async () => {
    const fundraiserFactory = FundraiserFactoryContract.deployed();
    assert(fundraiserFactory);
  });
});

contract("Fundraiser の作成を確認", (accounts) => {
  let fundraiserFactory;
  const name = "name";
  const description = "description";
  const url = "https://example.com/url";
  const imageUrl = "https://example.com/image_url";
  const now = new Date()
  const startedAt = now.getTime();
  const startedAtUint256 = toBN(startedAt);
  const endedAt = new Date(now.setFullYear(now.getFullYear() + 1)).getTime();
  const endedAtUint256 = toBN(endedAt);
  const donationsAmount = 10000;
  const donationsCount = 100;
  const beneficiary = accounts[1];

  it("Fundraisers の数が増えていること", async () => {
    fundraiserFactory = await FundraiserFactoryContract.deployed();
    const beforeFundraisersCount = await fundraiserFactory.fundraisersCount();
    await fundraiserFactory.createFundraiser(
      name,
      description,
      url,
      imageUrl,
      startedAtUint256,
      endedAtUint256,
      donationsAmount,
      donationsCount,
      beneficiary
    );
    const afterFundraisersCount = await fundraiserFactory.fundraisersCount();
    const diff = afterFundraisersCount - beforeFundraisersCount;

    assert.equal(diff, 1);
  });
});
