import React from "react";
import { Box, Modal, Fade } from "@mui/material";
import { tweet } from "../content";

const openSeaUrlDev =
	"https://testnets.opensea.io/account/rockstars-nft-hotness-dev";
const openSeaUrlProd = "https://opensea.io/account/rockstars-nft-hotness";

const etherscanRinkeby = "https://rinkeby.etherscan.io/tx/";

export function SuccessModal({
	txHash,
	txError,
	setTxError,
	modalOpen,
	setModalOpen,
}) {
	const style = {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		width: window.screen.width < 480 ? "70%" : 500,
		bgcolor: "ghostwhite",
		boxShadow: 24,
		p: 4,
		borderRadius: 2,
		fontWeight: "bold",
	};

	const content = {
		success: () => (
			<>
				<h1 style={{ textAlign: "center", paddingBottom: "15px" }}>Success!</h1>
				<div>
					<a
						href={tweet}
						className="external-link"
						alt="twitter"
						target="_blank"
						rel="noreferrer"
					>
						Share
					</a>{" "}
					your new Rockstar status on Twitter
				</div>
				<br />
				<div>
					View your transaction on{" "}
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
					to check out your Rockstar
				</div>
			</>
		),
		error: () => (
			<>
				<h1 style={{ textAlign: "center", paddingBottom: "15px" }}>Error</h1>
				<div>
					There was an error minting your Rockstar, and you've been refunded all
					ETH sent (minus gas fees).
				</div>
			</>
		),
	};

	const txStatus = txError ? "error" : "success";

	return (
		<Modal
			open={modalOpen}
			onClose={(_, reason) => {
				if (reason === "escapeKeyDown") {
					setModalOpen(false);
					setTxError(false);
				}
			}}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description"
		>
			<Fade in={modalOpen}>
				<Box sx={style}>{content[txStatus]}</Box>
			</Fade>
		</Modal>
	);
}
