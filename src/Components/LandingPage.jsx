import "./LandingPage.css";
import rockstarMain from "../images/rockstar-main.png";
import multicolor from "../images/multicolor.png";
import heat from "../images/heat.png";
import { ctaText, rareText, whyText } from "../content";
import { MintButton } from "./MintButton";
import { useEffect, useRef, useState } from "react";

const useOnScreen = (ref, rootMargin = "0px") => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				setIsVisible(entry.isIntersecting);
			},
			{
				rootMargin,
			}
		);

		const currentElement = ref?.current;

		if (currentElement) {
			observer.observe(currentElement);
		}

		return () => {
			observer.unobserve(currentElement);
		};
	}, []);

	return isVisible;
};

function RockstarImage({ src, isVisible = true }) {
	return (
		<div className={`${isVisible ? "fadeIn" : "not-visible"}`}>
			<img src={src} alt="rockstar" width="100%" />
		</div>
	);
}

export default function LandingPage({ web3, provider, Contract, isMobile }) {
	const ref1 = useRef(null);
	const ref2 = useRef(null);
	const isVisible1 = useOnScreen(ref1);
	const isVisible2 = useOnScreen(ref2);

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
	}

	return (
		<div>
			<div className="first">
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
						<MintButton web3={web3} provider={provider} Contract={Contract} />
					</div>

					<div className="spacer" />

					<div className="col-right">
						{!isMobile && <RockstarImage src={rockstarMain} />}
						{getHelperText()}
					</div>
				</div>
			</div>

			<div className="bgwhite">
				<div className="row">
					<div className="col-right">
						<RockstarImage src={heat} isVisible={isVisible1} />
					</div>
					<div className="spacer" />
					<div className="col-left" ref={ref1}>
						<div className="cta-text-wrapper">
							{whyText.map((line, i) => (
								<div
									key={i}
									style={{ animationDelay: `${0.5 + 0.6 * i}s` }}
									className={`rare-text ${isVisible1 ? "fadeInUp" : ""}`}
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
					{isMobile && <RockstarImage src={multicolor} />}
					<div className="col-left" ref={ref2}>
						<div className="cta-text-wrapper">
							{rareText.map((line, i) => (
								<div
									key={i}
									style={{ animationDelay: `${0.5 + 0.6 * i}s` }}
									className={`rare-text ${isVisible2 ? "fadeInUp" : ""}`}
								>
									{line}
								</div>
							))}
						</div>
					</div>
					<div className="spacer" />
					<div className="col-right">
						{!isMobile && <RockstarImage src={multicolor} />}
					</div>
				</div>
			</div>
		</div>
	);
}
