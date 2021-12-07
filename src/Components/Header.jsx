import { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import { socialMediaLinks } from "../content";
import "./Header.css";

import RockstarsNFTDevJSON from "../contracts/RockstarsNFTDev.json";

import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";

let provider;
let web3;

const GET_METAMASK = "Get Metamask";
const CONNECT_WALLET = "Connect Wallet";
const METAMASK_EXTENSION_URL =
	"https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en";
const METAMASK_APP_URL = "https://metamask.io/download";

const contractAddress = {
	rinkeby: "0x6063643B4EC6C2bf29af16982eC1B69446269F8e",
	local: "",
};

export function scrollToTop(top = 0) {
	window.scroll({ top, behavior: "smooth" });
}

export default function Header({
	setWeb3,
	setProvider,
	setContract,
	shrink,
	isMobile,
}) {
	const LISTENERS = [
		{ name: "accountsChanged", fn: handleAccountChanged },
		{ name: "chainChanged", fn: handleChainChanged },
	];

	const [connectBtnText, setConnectBtnText] = useState(CONNECT_WALLET);

	async function connectWallet() {
		provider = await detectEthereumProvider({ timeout: 1000 });

		if (!provider) {
			setConnectBtnText(GET_METAMASK);
			return;
		}

		addEventListeners(provider);
		web3 = new Web3(provider);
		const [selectedAccount] = await web3.eth.getAccounts();

		setContract(
			new web3.eth.Contract(RockstarsNFTDevJSON.abi, contractAddress.rinkeby)
		);
		setConnectBtnText(formatAccount(selectedAccount) || CONNECT_WALLET);
		setWeb3(web3);
		setProvider(provider);
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

		if (connectBtnText === GET_METAMASK) {
			if (isMobile) {
				window.open(METAMASK_APP_URL, "_blank").focus();
				return;
			}
			window.open(METAMASK_EXTENSION_URL, "_blank").focus();
			setConnectBtnText(CONNECT_WALLET);
			return;
		}

		connectWallet();
	}

	function formatAccount(account) {
		if (!account) {
			return;
		}

		return account.slice(0, 6) + "..." + account.slice(-6);
	}

	return (
		<div className={`header ${shrink ? "shadow" : ""}`}>
			<div className="logo">
				<Link to="/">
					<div className="logo-text" onClick={() => scrollToTop(0)}>
						R
					</div>
				</Link>
			</div>

			<div className="links-wrapper">
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
				</div>

				<button className="connect-btn" onClick={handleOnConnectWalletClick}>
					{connectBtnText}
				</button>
			</div>
		</div>
	);
}
