import { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import { socialMediaLinks } from "../content";
import "./Header.css";

import RockstarsNFTDevJSON from "../contracts/RockstarsNFTDev.json";

import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";

let provider;
let web3;

const INSTALL_METAMASK = "Install Metamask";
const CONNECT_WALLET = "Connect Wallet";
const METAMASK_CHROME_URL =
	"https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en";

const contractAddress = {
	ropsten: "0x01C2349afCB380cD98521C1Dcf78fe133041E766",
	rinkeby: "0x3025Cfb46Fc2E0f43468Fd5dDb107401d359e878",
	local: "0x92Ec4d055a33332D3421aF3E3e6a6bc5E51339D4",
};

export function scrollToTop(top = 0) {
	window.scroll({ top, behavior: "smooth" });
}

export default function Header({ setWeb3, setProvider, setContract, shrink }) {
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

		if (connectBtnText === INSTALL_METAMASK) {
			window.open(METAMASK_CHROME_URL, "_blank").focus();
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
