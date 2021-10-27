import { useEffect, useState } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import { TermsAndConditions } from "./Components/TermsAndConditions";
import rockstar from "./images/rockstar-main.png";
import RockstarsNFTDevJSON from "./contracts/RockstarsNFTDev.json";

import { socialMediaLinks, sections, ctaText } from "./content";

import "./App.css";
import { Footer } from "./Components/Footer";
import { MintButton } from "./Components/MintButton";

const contractAddress = {
	ropsten: "0x01C2349afCB380cD98521C1Dcf78fe133041E766",
	rinkeby: "0x3025Cfb46Fc2E0f43468Fd5dDb107401d359e878",
};

const openSeaUrlDev =
	"https://testnets.opensea.io/account/rockstars-nft-hotness-dev";
const openSeaUrlProd = "https://opensea.io/account/rockstars-nft-hotness";

const etherscanRinkeby = "https://rinkeby.etherscan.io/tx/";

let provider;
let web3;

function SuccessMessage({ txHash }) {
	return (
		<div className="success-message">
			Success! View your transaction on{" "}
			<a
				href={etherscanRinkeby + { txHash }}
				className="external-link"
				alt="mint rinkeby"
				target="_blank"
				rel="noreferrer"
			>
				Etherscan
			</a>{" "}
			and head over to{" "}
			<a
				href={openSeaUrlDev}
				className="external-link"
				alt="mint rinkeby"
				target="_blank"
				rel="noreferrer"
			>
				OpenSea
			</a>{" "}
			to check out your Rockstar.
		</div>
	);
}

function RockstarImage() {
	return (
		<div className="img-wrapper fadeIn">
			<img src={rockstar} alt="rockstar" width="95%" />
		</div>
	);
}

function App() {
	const [Contract, setContract] = useState();
	const [txHash, setTxHash] = useState();
	const isMobile = window.screen.width <= 480;

	function getHelperText() {
		if (!isMobile) {
			return (
				<div
					className="external-link fadeIn"
					style={{ animationDelay: "2.6s" }}
				>
					<a
						href="https://app.mycrypto.com/faucet"
						alt="mint rinkeby"
						target="_blank"
						rel="noreferrer"
					>
						Get some Rinkeby
					</a>
				</div>
			);
		}

		if (!web3) {
			<div>
				On mobile? Mint from the{" "}
				<a
					href="https://metamask.io/download"
					className="external-link"
					alt="metamask download"
					target="_blank"
					rel="noreferrer"
				>
					Metamask app
				</a>
			</div>;
		}
	}

	return (
		<>
			<Router>
				<Header setContract={setContract} />
				<Switch>
					<Route path="/" exact>
						<div className="body-wrapper">
							<div className="content">
								{isMobile && <RockstarImage />}
								<div className="block">
									<div className="cta-text-wrapper">
										{ctaText.map((line, i) => (
											<div
												style={{ animationDelay: `${0.5 + 0.6 * i}s` }}
												className="cta-text fadeInUp"
											>
												{line}
											</div>
										))}
										<MintButton
											Contract={Contract}
											setTxHash={setTxHash}
											web3={web3}
											isMobile={isMobile}
										/>
									</div>
									{!isMobile && <RockstarImage />}
								</div>
								<div className="block">
									<div>{txHash && <SuccessMessage txHash={txHash} />}</div>
									<div />
								</div>
							</div>

							{!txHash && getHelperText()}
						</div>
					</Route>
					<Route path="/terms">
						<TermsAndConditions />
					</Route>
				</Switch>
				<Footer isMobile={isMobile} />
			</Router>
		</>
	);
}

export default App;

function Header({ setContract }) {
	const INSTALL_METAMASK = "Install Metamask";
	const CONNECT_WALLET = "Connect Wallet";
	const METAMASK_CHROME_URL =
		"https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en";

	const LISTENERS = [
		{ name: "accountsChanged", fn: handleAccountChanged },
		{ name: "chainChanged", fn: handleChainChanged },
	];

	const [connectBtnText, setConnectBtnText] = useState(CONNECT_WALLET);

	async function connectWallet() {
		provider = await detectEthereumProvider({ timeout: 1000 });

		if (!provider) {
			setConnectBtnText(INSTALL_METAMASK);
			return;
		}

		addEventListeners(provider);
		web3 = new Web3(provider);
		const [selectedAccount] = await web3.eth.getAccounts();

		setContract(
			new web3.eth.Contract(RockstarsNFTDevJSON.abi, contractAddress.rinkeby)
		);
		setConnectBtnText(formatAccount(selectedAccount) || CONNECT_WALLET);
	}

	useEffect(() => {
		connectWallet();

		return () => {
			removeEventListeners();
		};
	}, []);

	function addEventListeners(provider) {
		LISTENERS.forEach(event => provider.on(event.name, event.fn));
	}

	function removeEventListeners() {
		LISTENERS.forEach(event => provider.removeListener(event.name, event.fn));
	}

	function handleChainChanged(chainId) {
		window.location.reload();
		console.log(chainId);
	}

	function handleAccountChanged(accounts) {
		setConnectBtnText(formatAccount(accounts[0]) || CONNECT_WALLET);
	}

	async function handleOnConnectWalletClick() {
		if (web3) {
			await web3.eth.requestAccounts();
			return;
		}

		if (connectBtnText === INSTALL_METAMASK) {
			window.open(METAMASK_CHROME_URL, "_blank").focus();
			setConnectBtnText(CONNECT_WALLET);
			return;
		}

		connectWallet();
	}

	function scrollToTop() {
		window.scroll({ top: 0, behavior: "smooth" });
	}

	function formatAccount(account) {
		if (!account) {
			return;
		}

		return account.slice(0, 6) + "..." + account.slice(-6);
	}
	return (
		<div className="header">
			<div className="header-wrapper">
				<Link to="/">
					<div className="logo-text" onClick={scrollToTop}>
						R
					</div>
				</Link>
				<div className="links">
					{socialMediaLinks.map(link => (
						<a
							key={link.name}
							className="link"
							href={link.href}
							target="_blank"
							rel="noreferrer"
						>
							<i className={link.iconClass} alt={link.name} />
						</a>
					))}

					<div className="connect-btn" onClick={handleOnConnectWalletClick}>
						{connectBtnText}
					</div>
				</div>
			</div>
		</div>
	);
}
