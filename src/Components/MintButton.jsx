import React, { useState } from "react";
import "./MintButton.css";

export function MintButton({ Contract, setTxHash, web3 }) {
	const MAX_COUNT = 10;
	const [btnText, setBtnText] = useState();
	const [minting, setMinting] = useState(false);
	const [canMint, setCanMint] = useState(true);
	const [count, setCount] = useState(1);

	function handleChangeCount(step) {
		const nextCount = count + step;
		if (nextCount > MAX_COUNT || nextCount < 1) {
			return;
		}
		setCount(nextCount);
	}

	async function onMint() {
		try {
			const [from] = await web3.eth.requestAccounts();
			const id = await web3.eth.net.getId();
			if (id !== 4) {
				window.alert(
					"Mint failed!\nNot connected to Ethereum Mainnet\nPlease switch to Mainnet and try again"
				);
				return;
			}
			const cost = await Contract.methods.cost().call();
			const value = cost * count;
			console.log(cost, value);

			Contract.methods
				.mint(from, count)
				.send({
					from,
					value,
				})
				.once("sending", res => {
					setCanMint(false);
					console.log("sending", res);
				})
				.once("sent", res => console.log("sent", res))
				.once("transactionHash", res => {
					console.log("transactionHash", res);
					setMinting(true);
					setBtnText("Minting! Get pumped");
				})
				.once("receipt", res => console.log("receipt", res))
				.on("confirmation", res => console.log("confirmation", res))
				.on("error", res => {
					setMinting(false);
					setCanMint(true);
					console.log("error", res);
				})
				.then(res => {
					setBtnText("Minted!");
					setTxHash(res.transactionHash);
				});
		} catch (e) {
			console.log("catch", e);
		}
	}

	const disableButtons = !web3 || !canMint;

	return (
		<div className="fadeIn mint-btn-wrapper">
			<button className="mint-btn" onClick={onMint} disabled={disableButtons}>
				{minting ? btnText : `Mint ${count} Rockstar${count > 1 ? "s" : ""}`}
			</button>
			<div className="count-btn-wrapper">
				<button
					className="count-btn"
					disabled={disableButtons || count === MAX_COUNT}
					onClick={() => handleChangeCount(1)}
				>
					{"▲"}
				</button>
				<button
					className="count-btn"
					disabled={disableButtons || count === 1}
					onClick={() => handleChangeCount(-1)}
				>
					{"▼"}
				</button>
			</div>
		</div>
	);
}
