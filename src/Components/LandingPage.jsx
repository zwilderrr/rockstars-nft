import "./LandingPage.css";
import rockstarMain from "../images/rockstar-main.png";
import multicolor from "../images/multicolor.png";
import heat from "../images/heat.png";
import { ctaText, rareText, whyText } from "../content";
import { MintButton } from "./MintButton";
import { useEffect, useRef, useState } from "react";
import { ContentModal } from "./ContentModal";

export const useOnScreen = (ref, cb, isMobile = false) => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				cb && cb(!entry.isIntersecting);
				setIsVisible(entry.isIntersecting);
			},
			{
				rootMargin: "0px",
				threshold: cb ? (isMobile ? 0.6 : 0.8) : 0,
				// threshold: cb ? 0.8 : 0,
			}
		);

		const currentElement = ref?.current;

		if (currentElement) {
			observer.observe(currentElement);
		}

		return () => {
			observer && observer.unobserve(currentElement);
		};
	}, []);

	return isVisible;
};

function useSetShow(isVisible) {
	const [show, setShow] = useState(false);

	useEffect(() => {
		isVisible && setShow(true);
	}, [isVisible]);

	return show;
}

function RockstarImage({ src, show = true }) {
	return (
		<div className={`${show ? "fadeIn" : "not-visible"}`}>
			<img src={src} alt="rockstar" width="100%" />
		</div>
	);
}

export default function LandingPage({
	web3,
	Contract,
	isMobile,
	setShrinkHeader,
}) {
	const ref1 = useRef(null);
	const ref2 = useRef(null);
	const ref3 = useRef(null);
	const isVisible1 = useOnScreen(ref1);
	const isVisible2 = useOnScreen(ref2);
	useOnScreen(ref3, setShrinkHeader, true);

	const show1 = useSetShow(isVisible1);
	const show2 = useSetShow(isVisible2);

	const [txHash, setTxHash] = useState();
	const [modalOpen, setModalOpen] = useState(false);
	const [txError, setTxError] = useState(false);

	useEffect(() => {
		if (txHash || txError) {
			setModalOpen(true);
		}
	}, [txHash, txError]);

	function getHelperText() {
		if (isMobile) {
			return (
				<div className="fadeIn" style={{ animationDelay: "2.6s" }}>
					On mobile? Go to rockstars.buzz on the{" "}
					<a
						href="https://metamask.io/download"
						className="external-link"
						alt="metamask download"
						target="_blank"
						rel="noreferrer"
					>
						Metamask
					</a>{" "}
					app browser
				</div>
			);
		}

		if (!web3) {
			return (
				<div className="fadeIn helper-text" style={{ animationDelay: "2.6s" }}>
					Looks like you don't have a crypto wallet installed on your browser.
					{/* Watch the{" "}
					<a
						href="https://metamask.io/download"
						className="external-link"
						alt="metamask download"
						target="_blank"
						rel="noreferrer"
					>
						how to
					</a>{" "}
					video posted on Twitter to get started. */}
				</div>
			);
		}
	}

	return (
		<div>
			<div className="first" ref={ref3}>
				<div className="row">
					{isMobile && <RockstarImage src={rockstarMain} />}

					<div className="col-left">
						<div className="cta-text-wrapper">
							{ctaText.map((line, i) => (
								<div
									key={i}
									style={{ animationDelay: `${0.5 + 0.6 * i}s` }}
									className="cta-text fadeInUp"
								>
									{line}
								</div>
							))}
						</div>
						<MintButton
							web3={web3}
							Contract={Contract}
							setTxHash={setTxHash}
							setTxError={setTxError}
						/>
						{!isMobile && getHelperText()}
					</div>

					<div className="spacer" />

					<div className="col-right">
						{!isMobile && <RockstarImage src={rockstarMain} />}
						{isMobile && getHelperText()}
					</div>
				</div>
			</div>

			<div className="bgwhite">
				<div className="row">
					<div className="col-right">
						<RockstarImage src={heat} show={show1} />
					</div>
					<div className="spacer" />
					<div className="col-left">
						<div className="body-text-wrapper" ref={ref1}>
							{whyText.map((line, i) => (
								<div
									key={i}
									style={{ animationDelay: ".5s" }}
									className={`body-text ${show1 ? "fadeInUp" : ""}`}
								>
									{line}
								</div>
							))}
						</div>
					</div>
				</div>
			</div>

			<div>
				<div className="row">
					{isMobile && <RockstarImage src={multicolor} show={show2} />}
					<div className="col-left">
						<div className="body-text-wrapper" ref={ref2}>
							{rareText.map((line, i) => (
								<div
									key={i}
									style={{ animationDelay: ".5s" }}
									className={`body-text ${show2 ? "fadeInUp" : ""}`}
								>
									{line}
								</div>
							))}
						</div>
					</div>
					<div className="spacer" />
					<div className="col-right">
						{!isMobile && <RockstarImage src={multicolor} show={show2} />}
					</div>
				</div>
			</div>
			<ContentModal
				modalOpen={modalOpen}
				txHash={txHash}
				txError={txError}
				setTxError={setTxError}
				setModalOpen={setModalOpen}
				isMobile={isMobile}
			/>
		</div>
	);
}
