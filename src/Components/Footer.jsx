import "./Footer.css";
import { socialMediaLinks, termsLink } from "../content";
import { useLocation } from "react-router";

export function Footer({ isMobile }) {
	const isTerms = useLocation().pathname.includes("/terms");

	return (
		<div
			className="footer"
			style={{ position: isTerms || isMobile ? "static" : "fixed" }}
		>
			<div className="logo-text">Rockstars</div>
			<div className="links">
				{[...socialMediaLinks, termsLink].map(link => (
					<a
						key={link.name}
						className="link"
						href={link.href}
						target={link.name !== "terms" ? "_blank" : undefined}
						rel="noreferrer"
					>
						{link.name}
					</a>
				))}
			</div>
		</div>
	);
}
