const { toBN } = require('web3-utils');

const FundraiserContract = artifacts.require("Fundraiser");

contract("Fundraiser", (accounts) => {
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
  const custodian = accounts[0];

  beforeEach(async () => {
    fundraiser = await FundraiserContract.new(
      name,
      description,
      url,
      imageUrl,
      startedAtUint256,
      endedAtUint256,
      donationsAmount,
      donationsCount,
      beneficiary,
      custodian
    );
  });

  describe("初期値の確認", () => {
    it("name が初期値として与えた値になること", async () => {
      const actual = await fundraiser.name();
      assert.equal(actual, name);
    });

    it("description が初期値として与えた値になること", async () => {
      const actual = await fundraiser.description();
      assert.equal(actual, description);
    });

    it("url が初期値として与えた値になること", async () => {
      const actual = await fundraiser.url();
      assert.equal(actual, url);
    });

    it("imageUrl が初期値として与えた値になること", async () => {
      const actual = await fundraiser.imageUrl();
      assert.equal(actual, imageUrl);
    });

    it("startedAtUint256 が初期値として与えた値になること", async () => {
      const actual = await fundraiser.startedAt();
      assert.equal(actual, startedAt);
    });

    it("endedAtUint256 が初期値として与えた値になること", async () => {
      const actual = await fundraiser.endedAt();
      assert.equal(actual, endedAt);
    });

    it("donationsAmount が初期値として与えた値になること", async () => {
      const actual = await fundraiser.donationsAmount();
      assert.equal(actual, donationsAmount);
    });

    it("donationsCount が初期値として与えた値になること", async () => {
      const actual = await fundraiser.donationsCount();
      assert.equal(actual, donationsCount);
    });

    it("beneficiary が初期値として与えた値になること", async () => {
      const actual = await fundraiser.beneficiary();
      assert.equal(actual, beneficiary);
    });

    it("owner が初期値として与えた値になること", async () => {
      const actual = await fundraiser.owner();
      assert.equal(actual, custodian);
    });
  });
});
