import "./LandingPage.css";
import rockstarMain from "../images/rockstar-main.png";
import multicolor from "../images/multicolor.png";
import heat from "../images/heat.png";
import { ctaText, rareText, whyText } from "../content";
import { MintButton } from "./MintButton";

function RockstarImage({ src }) {
	return (
		<div className="fadeIn">
			<img src={src} alt="rockstar" width="100%" />
		</div>
	);
}

export default function LandingPage({ web3, provider, Contract }) {
	return (
		<div>
			<div className="row-wrapper">
				<div className="row">
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

							<MintButton web3={web3} provider={provider} Contract={Contract} />
						</div>
					</div>

					<div className="spacer" />

					<div className="col-right">
						<RockstarImage src={rockstarMain} />
					</div>
				</div>
			</div>

			<div className="bgwhite">
				<div className="row">
					<div className="col-right">
						<RockstarImage src={heat} />
					</div>
					<div className="spacer" />
					<div className="col-left">
						<div
							className="cta-text-wrapper"
							style={{ paddingBottom: "100px" }}
						>
							{whyText.map((line, i) => (
								<div
									key={i}
									style={{ animationDelay: `${0.5 + 0.6 * i}s` }}
									className="rare-text fadeInUp"
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
					<div className="col-left">
						<div
							className="cta-text-wrapper"
							style={{ paddingBottom: "100px" }}
						>
							{rareText.map((line, i) => (
								<div
									key={i}
									style={{ animationDelay: `${0.5 + 0.6 * i}s` }}
									className="rare-text fadeInUp"
								>
									{line}
								</div>
							))}
						</div>
					</div>
					<div className="spacer" />
					<div className="col-right">
						<RockstarImage src={multicolor} />
					</div>
				</div>
			</div>
		</div>
	);
}
