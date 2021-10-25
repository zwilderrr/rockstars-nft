// const RockstarsNFT = artifacts.require("RockstarsNFT");
const RockstarsNFTDev = artifacts.require("RockstarsNFTDev");

const baseUrlDev = "https://rockstars-nft-dev.s3.us-east-2.amazonaws.com/";
const baseUrlProd = "https://rockstars-nft.s3.us-east-2.amazonaws.com/";

module.exports = async function (deployer, network) {
	switch (network) {
		case "prod":
			// deployer.deploy(RockstarsNFT, "RockstarsNFT", "RNFT", baseUrlProd);
			break;
		default:
			deployer.deploy(RockstarsNFTDev, "RockstarsNFTDev", "RNFTD", baseUrlDev);
	}
};
