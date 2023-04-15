const Dumpling = artifacts.require("Dumpling");
const ERC20Mock = artifacts.require("ERC20Mock");
const truffleAssert = require('truffle-assertions');
const { time } = require("@openzeppelin/test-helpers");

contract("Dumpling", (accounts) => {
  const [burrower, lender1, lender2] = accounts;

  beforeEach(async () => {
    this.token = await ERC20Mock.new();
    this.dumpling = await Dumpling.new(this.token.address, burrower);
  });

  it("should lend funds successfully", async () => {
    await this.token.mint(lender1, web3.utils.toWei("20", "ether"));
    const duration = 60 * 24 * 60 * 60; // 60 days
    const amount = web3.utils.toWei("10", "ether");
    await this.token.approve(this.dumpling.address, amount, { from: lender1 });
    const result = await this.dumpling.lendFunds(duration, { from: lender1 });
    truffleAssert.eventEmitted(result, "FundsLent", (ev) => {
      return (
        ev.lender === lender1 &&
        ev.amount.toString() === amount &&
        ev.duration.toString() === duration.toString()
      );
    });
  });

  it("should pull funds successfully", async () => {
    await this.token.mint(lender1, web3.utils.toWei("20", "ether"));
    const duration = time.duration.days(60);
    const amount = web3.utils.toWei("10", "ether");
    await this.token.approve(this.dumpling.address, amount, { from: lender1 });
    await this.dumpling.lendFunds(duration, { from: lender1 });
    await time.increase(duration);
    const result = await this.dumpling.pullFunds({ from: lender1 });
    truffleAssert.eventEmitted(result, "FundsPulled", (ev) => {
      return ev.lender === lender1 && ev.amount.toString() !== "0";
    });
  });

  it("should revert when attempting to lend funds with an invalid duration", async () => {
    const invalidDuration = 123456;
    const amount = web3.utils.toWei("10", "ether");
    await this.token.approve(this.dumpling.address, amount, { from: lender1 });
    await truffleAssert.reverts(
      this.dumpling.lendFunds(invalidDuration, { from: lender1 }),
      "Invalid duration"
    );
  });

  it("should revert when attempting to lend funds with an existing position", async () => {
    await this.token.mint(lender1, web3.utils.toWei("20", "ether"));
    const duration1 = time.duration.days(60);
    const duration2 = time.duration.days(30);
    const amount = web3.utils.toWei("10", "ether");
    await this.token.approve(this.dumpling.address, amount, { from: lender1 });
    await this.dumpling.lendFunds(duration1, { from: lender1 });
    await truffleAssert.reverts(
      this.dumpling.lendFunds(duration2, { from: lender1 }),
      "Existing position not yet finished"
    );
  });

  it("should revert when attempting to pull funds with no funds", async () => {
    await truffleAssert.reverts(
      this.dumpling.pullFunds({ from: lender1 }),
      "No funds to pull"
    );
  });

  it("should revert when attempting to withdraw funds with no funds", async () => {
    await truffleAssert.reverts(
      this.dumpling.withdrawFunds(web3.utils.toWei("1", "ether"), { from: burrower }),
      "ERC20: transfer amount exceeds balance"
    );
  });

  it("should withdraw funds successfully", async () => {
    await this.token.mint(lender1, web3.utils.toWei("20", "ether"));
    const duration = time.duration.days(60);
    const amount = web3.utils.toWei("10", "ether");
    await this.token.approve(this.dumpling.address, amount, { from: lender1 });
    await this.dumpling.lendFunds(duration, { from: lender1 });
    const result = await this.dumpling.withdrawFunds(web3.utils.toWei("1", "ether"), { from: burrower });
    truffleAssert.eventEmitted(result, "FundsWithdrawn", (ev) => {
      return ev.amount.toString() !== "0";
    });
  });

  it("should fail to withdraw funds not by the borrower", async () => {
    await this.token.mint(lender1, web3.utils.toWei("20", "ether"));
    const duration = time.duration.days(60);
    const amount = web3.utils.toWei("10", "ether");
    await this.token.approve(this.dumpling.address, amount, { from: lender1 });
    await this.dumpling.lendFunds(duration, { from: lender1 });
    await truffleAssert.reverts(
      this.dumpling.withdrawFunds(web3.utils.toWei("1", "ether"), { from: lender2 }),
      "Only borrower can withdraw funds"
    );
  });
});
