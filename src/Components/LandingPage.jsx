import "./LandingPage.css";
import rockstar from "../images/rockstar-main.png";
import { ctaText } from "../content";
import { MintButton } from "./MintButton";

function RockstarImage() {
	return (
		<div className="fadeIn">
			<img src={rockstar} alt="rockstar" width="100%" />
		</div>
	);
}

export default function LandingPage({ web3, provider, Contract }) {
	return (
		<div className="landing-wrapper">
			<div className="row first">
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
					<RockstarImage />
				</div>
			</div>
		</div>
	);
}
