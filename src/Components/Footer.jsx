import "./Footer.css";

export function Footer() {
	const isFixed = !window.location.pathname.includes("terms");

	return (
		<div className="footer" style={{ position: isFixed ? "fixed" : "static" }}>
			<div className="logo-text">Rockstars</div>
		</div>
	);
}
