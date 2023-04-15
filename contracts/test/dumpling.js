const Dumpling = artifacts.require("Dumpling");

contract("Dumpling", (accounts) => {
  let dumplingInstance;

  before(async () => {
    dumplingInstance = await Dumpling.new();
  });

  it("should allow lenders to lend money", async () => {
    const lender1 = accounts[0];
    const lender2 = accounts[1];
    const borrower = accounts[2];
    const amount = web3.utils.toWei("1", "ether");

    await dumplingInstance.lend(borrower, { from: lender1, value: amount });
    await dumplingInstance.lend(borrower, { from: lender2, value: amount });

    const totalLenders = await dumplingInstance.getTotalLenders();
    assert.equal(totalLenders, 2, "Incorrect total lenders count");

    const lenders = await dumplingInstance.getLenders();
    assert.equal(lenders[0], lender1, "Incorrect lender1 address");
    assert.equal(lenders[1], lender2, "Incorrect lender2 address");
  });

  it("should not allow non-lenders to lend money", async () => {
    const nonLender = accounts[3];
    const borrower = accounts[4];
    const amount = web3.utils.toWei("1", "ether");

    try {
      await dumplingInstance.lend(borrower, { from: nonLender, value: amount });
    } catch (error) {
      assert(error.message.includes("revert"), "Incorrect error message");
    }

    const totalLenders = await dumplingInstance.getTotalLenders();
    assert.equal(totalLenders, 2, "Total lenders count should not change");
  });

  it("should not allow borrowers to lend money", async () => {
    const lender = accounts[0];
    const borrower = accounts[2];
    const amount = web3.utils.toWei("1", "ether");

    try {
      await dumplingInstance.lend(borrower, { from: borrower, value: amount });
    } catch (error) {
      assert(error.message.includes("revert"), "Incorrect error message");
    }

    const totalLenders = await dumplingInstance.getTotalLenders();
    assert.equal(totalLenders, 2, "Total lenders count should not change");
  });

  it("should allow lenders to withdraw their funds after repayment", async () => {
    const lender1 = accounts[0];
    const lender2 = accounts[1];
    const borrower = accounts[2];
    const amount = web3.utils.toWei("1", "ether");

    await dumplingInstance.repay({ from: borrower, value: amount });

    const initialBalance1 = await web3.eth.getBalance(lender1);
    const initialBalance2 = await web3.eth.getBalance(lender2);

    await dumplingInstance.withdraw({ from: lender1 });
    await dumplingInstance.withdraw({ from: lender2 });

    const finalBalance1 = await web3.eth.getBalance(lender1);
    const finalBalance2 = await web3.eth.getBalance(lender2);

    assert(finalBalance1 > initialBalance1, "Incorrect balance for lender1");
    assert(finalBalance2 > initialBalance2, "Incorrect balance for lender2");
  });

  it("should not allow lenders to withdraw before repayment", async () => {
    const lender = accounts[0];

    try {
      await dumplingInstance.withdraw({ from: lender });
    } catch (error) {
      assert(error.message.includes("revert"), "Incorrect error message");
    }
    // Check that the lender's balance remains unchanged
    const initialBalance = await web3.eth.getBalance(lender);
    await dumplingInstance.repay({ from: borrower, value: web3.utils.toWei("0.5", "ether") });
    await dumplingInstance.repay({ from: borrower, value: web3.utils.toWei("0.5", "ether") });
    const finalBalance = await web3.eth.getBalance(lender);
    assert.equal(finalBalance, initialBalance, "Lender should not have withdrawn funds");
});
it("should allow borrowers to repay their debt", async () => {
    const lender = accounts[0];
    const borrower = accounts[2];
    const amount = web3.utils.toWei("1", "ether");
    await dumplingInstance.lend(borrower, { from: lender, value: amount });

const initialDebt = await dumplingInstance.getDebt(borrower);
await dumplingInstance.repay({ from: borrower, value: amount });
const finalDebt = await dumplingInstance.getDebt(borrower);

assert.equal(finalDebt.toString(), "0", "Debt should be fully repaid");
assert(initialDebt > finalDebt, "Debt should have decreased");
});

it("should not allow borrowers to repay more than their debt", async () => {
const lender = accounts[0];
const borrower = accounts[2];
const amount = web3.utils.toWei("1", "ether");
await dumplingInstance.lend(borrower, { from: lender, value: amount });

const initialDebt = await dumplingInstance.getDebt(borrower);

try {
  await dumplingInstance.repay({ from: borrower, value: web3.utils.toWei("1.5", "ether") });
} catch (error) {
  assert(error.message.includes("revert"), "Incorrect error message");
}

const finalDebt = await dumplingInstance.getDebt(borrower);

assert.equal(finalDebt.toString(), initialDebt.toString(), "Debt should remain unchanged");
});
});
