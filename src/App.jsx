import { useEffect, useState } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";

import rockstar from "./images/rockstar5.png";
import RockstarsNFTDevJSON from "./contracts/RockstarsNFTDev.json";
import { sections, ctaText } from "./content";

import "./App.css";

const contractAddress = {
	ropsten: "0x01C2349afCB380cD98521C1Dcf78fe133041E766",
};

let provider;
let web3;

function App() {
	// useEffect(() => {
	//   const body = document.querySelector(".body-wrapper");
	//   const header = document.querySelector(".header");
	//   // see https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
	// }, []);

	const [Contract, setContract] = useState();

	return (
		<>
			<Header setContract={setContract} />
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
							<MintButton Contract={Contract} />
						</div>
						<div className="img-wrapper fadeIn">
							<img src={rockstar} alt="rockstar" width="95%" />
						</div>
					</div>
					<div className="rinkeby-link">
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
			</div>

			<div className="footer">
				<div className="logo-text" style={{ color: "white" }}>
					Rockstars
				</div>
			</div>
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
			new web3.eth.Contract(RockstarsNFTDevJSON.abi, contractAddress.ropsten)
		);
		setConnectBtnText(selectedAccount || CONNECT_WALLET);
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
		setConnectBtnText(accounts[0] || CONNECT_WALLET);
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

	function scrollToSection(title) {
		document.querySelector("#" + title).scrollIntoView({ behavior: "smooth" });
	}

	function scrollToTop() {
		window.scroll({ top: 0, behavior: "smooth" });
	}

	const hoverEnabled =
		connectBtnText !== CONNECT_WALLET && connectBtnText !== INSTALL_METAMASK;

	return (
		<div className="header">
			<div className="header-wrapper">
				<div className="logo-text" onClick={scrollToTop}>
					R
				</div>
				<div className="links">
					{sections.map(s => (
						<div
							key={s.title}
							className="link"
							onClick={() => scrollToSection(s.title)}
						>
							{s.title}
						</div>
					))}
					<div
						className={`connect-btn ${hoverEnabled ? "connect-btnHover" : ""}`}
						onClick={handleOnConnectWalletClick}
					>
						{connectBtnText}
					</div>
				</div>
			</div>
		</div>
	);
}

function MintButton({ Contract }) {
	const MAX_COUNT = 10;
	const [btnText, setBtnText] = useState("Mint on Rinkeby");
	const [minting, setMinting] = useState(false);
	const [count, setCount] = useState(1);

	function handleChangeCount(step) {
		const nextCount = count + step;
		if (nextCount > MAX_COUNT || nextCount < 1) {
			return;
		}
		setCount(nextCount);
	}

	async function onMint() {
		// check for correct network id

		const [from] = await web3.eth.requestAccounts();

		Contract.methods.mint([from, 1]);

		web3.eth
			.sendTransaction({
				from: from[0],
				to: "0x30601714cdbEEde3E659ACc942685315258e6f70",
				value: "29900000000000",
				chain: "3",
			})
			.once("sending", res => console.log("sending", res))
			.once("sent", res => console.log("sent", res))
			.once("transactionHash", res => console.log("transactionHash", res))
			.once("receipt", res => console.log("receipt", res))
			.on("confirmation", res => console.log("confirmation", res))
			.on("error", res => console.log("error", res))
			.then(res => console.log("mined", res));
	}

	return (
		<div className="mint-btn-wrapper fadeIn">
			<button className="mint-btn" onClick={onMint}>
				{minting ? "Minting!" : `Mint ${count} on Rinkeby`}
			</button>
			<div className="count-btn-wrapper">
				<button
					className="count-btn"
					disabled={count === MAX_COUNT}
					onClick={() => handleChangeCount(1)}
				>
					{"▲"}
				</button>
				<button
					className="count-btn"
					disabled={count === 1}
					onClick={() => handleChangeCount(-1)}
				>
					{"▼"}
				</button>
			</div>
		</div>
	);
}
