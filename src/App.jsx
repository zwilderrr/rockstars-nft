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
	"https://testnets.opensea.io/account/rockstars-nft-hotness";
const openSeaUrlProd = "https://opensea.io/account/rockstars-nft-hotness";

let provider;
let web3;

function App() {
	// useEffect(() => {
	//   const body = document.querySelector(".body-wrapper");
	//   const header = document.querySelector(".header");
	//   // see https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
	// }, []);

	const [Contract, setContract] = useState();
	const [onSuccess, setOnSuccess] = useState(false);

	return (
		<>
			<Router>
				<Header setContract={setContract} />
				<Switch>
					<Route path="/" exact>
						<div className="body-wrapper">
							<div className="content">
								<div className="block">
									<div className="ctaText-wrapper">
										{ctaText.map((line, i) => (
											<div
												style={{ animationDelay: `${0.5 + 0.6 * i}s` }}
												className="ctaText fadeInUp"
											>
												{line}
											</div>
										))}
										<MintButton
											Contract={Contract}
											setOnSuccess={setOnSuccess}
											web3={web3}
										/>
									</div>
									<div className="img-wrapper fadeIn">
										<img src={rockstar} alt="rockstar" width="95%" />
									</div>
								</div>
							</div>
							{onSuccess && (
								<div className="external-link">
									Head over to{" "}
									<a
										href={openSeaUrlDev}
										alt="mint rinkeby"
										target="_blank"
										rel="noreferrer"
									>
										OpenSea
									</a>{" "}
									to view your Rockstar!
								</div>
							)}
							<div className="external-link">
								<a
									href="https://app.mycrypto.com/faucet"
									alt="mint rinkeby"
									target="_blank"
									rel="noreferrer"
								>
									Get some Rinkeby
								</a>
							</div>
						</div>
					</Route>
					<Route path="/terms">
						<TermsAndConditions />
					</Route>
				</Switch>
				<Footer />
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

	const [connectBtnText, setConnectBtnText] = useState();

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
		console.log("hey");
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

	function scrollToSection(title) {
		document.querySelector("#" + title).scrollIntoView({ behavior: "smooth" });
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
