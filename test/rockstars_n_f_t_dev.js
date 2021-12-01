const RockstarsNFTDev = artifacts.require("RockstarsNFTDev");
const truffleAssert = require("truffle-assertions");

contract("RockstarsNFTDev", function (accounts) {
	let instance;
	let owner;

	before("setup the contract instance and owner", async () => {
		instance = await RockstarsNFTDev.deployed();
		owner = await instance.owner();
	});

	it("should mint 5 to the owner", async () => {
		const walletOfOwner = await instance.walletOfOwner(owner);
		assert.equal(walletOfOwner.length, 5);
	});

	it("should successfully mint up to 5 at a time", async () => {
		for (let i = 2; i <= 5; i++) {
			const from = accounts[i - 1];
			await instance.mint(from, i);
			const walletOfOwner = await instance.walletOfOwner(from);
			assert.equal(walletOfOwner.length, i);
		}
	});

	it("should not permit minting more than 5 at a time", async () => {
		await truffleAssert.reverts(
			instance.mint(accounts[1], 6),
			"revert",
			"Can't mint more than 5"
		);
	});

	it("should increase total supply by amount minted", async () => {
		for (let i = 1; i <= 5; i++) {
			let supply = await instance.totalSupply();
			supply = bigToNum(supply);
			await instance.mint(accounts[i], i);

			let newSupply = await instance.totalSupply();
			newSupply = bigToNum(newSupply);

			assert.equal(supply + i, newSupply);
		}
	});

	it("should not mint if contract is paused", async () => {
		const from = accounts[2];

		await instance.mint(from, 1);

		await instance.pause(true);

		await truffleAssert.reverts(instance.mint(owner, 1), "revert");

		await instance.pause(false);

		await instance.mint(owner, 1);
	});

	it("should accept an array of allowlisted accounts", async () => {
		// should fail because accounts[3] isn't sending any ether with the request
		await truffleAssert.reverts(
			instance.mint(accounts[3], 1, { from: accounts[3] }),
			"revert"
		);
		const allowlist = [accounts[3], accounts[4]];

		await instance.allowlistUser(allowlist);

		await instance.mint(accounts[3], 1, { from: accounts[3] });

		await instance.removeAllowlistUser(allowlist);

		await truffleAssert.reverts(
			instance.mint(accounts[3], 1, { from: accounts[3] }),
			"revert"
		);
	});
});

describe("Test web3", function () {
	let instance;
	let owner;
	let accounts;
	let Contract;

	before("setup the contract instance and owner", async () => {
		instance = await RockstarsNFTDev.deployed();
		owner = await instance.owner();
		accounts = await web3.eth.getAccounts();
		Contract = new web3.eth.Contract(
			RockstarsNFTDev._json.abi,
			instance.address
		);
	});

	it("should successfully mint up to 5 at a time", async () => {
		const cost = await Contract.methods.cost().call();
		for (let i = 2; i <= 5; i++) {
			const from = accounts[i - 1];
			const value = cost * i;
			let beforeMint = await instance.walletOfOwner(from);
			await Contract.methods.mint(from, i).send({ from, value, gas: 1000000 });
			const afterMint = await instance.walletOfOwner(from);
			assert.equal(afterMint.length, beforeMint.length + i);
		}
	});

	it("should not permit minting more than 5 at a time", async () => {
		const cost = await Contract.methods.cost().call();
		const from = accounts[2];
		const value = cost * 6;
		await truffleAssert.reverts(
			Contract.methods.mint(from, 6).send({ from, value, gas: 1000000 }),
			"revert",
			"Can't mint more than 10"
		);
	});

	it("should require correct payment", async () => {
		const from = accounts[2];
		const value = web3.utils.toWei("1");

		await instance.setCost(web3.utils.toWei("2"));

		await truffleAssert.reverts(
			Contract.methods.mint(from, 1).send({ from, value, gas: 1000000 }),
			"revert",
			"Not enough Eth sent"
		);
	});

	it("should only allow owner to withdraw", async () => {
		await instance.mint(accounts[1], 1);
		const contractBalanceBeforeWithdraw = await web3.eth.getBalance(
			instance.address
		);

		assert.notEqual(contractBalanceBeforeWithdraw, "0");

		await truffleAssert.reverts(
			Contract.methods.withdraw().send({ from: accounts[1] })
		);

		await Contract.methods.withdraw().send({ from: owner });

		const contractBalanceAfterWithdraw = await web3.eth.getBalance(
			instance.address
		);

		assert.notEqual(
			contractBalanceBeforeWithdraw,
			contractBalanceAfterWithdraw
		);

		assert.equal(contractBalanceAfterWithdraw, "0");
	});
});

function bigToNum(n) {
	return Number(BigInt(n));
}

function toEth(n) {
	return web3.utils.fromWei(n);
}
