import "./About.css";
import { Image } from "./LandingPage";
import zack from "../images/zack.png";
import gail from "../images/gail.png";

const staff = [
	{
		name: "Zack",
		img: zack,
		title: "Software Engineer @ Coinbase",
		funFact: "Pixel artist and latte enthusiast",
	},
	{
		name: "Abby",
		img: gail,
		title: "Product @ RockstarsNFT",
		funFact: "Yoga master and gourmet chef",
	},
];

export function About({ isMobile }) {
	return (
		<div className="about-wrapper">
			{/* <div className="about-header">Lead Rockers</div> */}
			<div className="profile-wrapper">
				{staff.map(s => (
					<div className="profile">
						<Image
							src={s.img}
							style={{ height: "200px", width: "200px", borderRadius: "50%" }}
						/>
						<div className="about-name">{s.name}</div>
						<div className="about-title">{s.title}</div>
						<div className="about-funFact">
							<i>{s.funFact}</i>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
