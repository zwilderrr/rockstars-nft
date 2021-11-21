import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Footer } from "./Components/Footer";
import Header from "./Components/Header";
import LandingPage from "./Components/LandingPage";
import { TermsAndConditions } from "./Components/TermsAndConditions";

export default function App() {
	const [web3, setWeb3] = useState();
	const [provider, setProvider] = useState();
	const [Contract, setContract] = useState();
	const isMobile = window.screen.width <= 480;

	return (
		<Router>
			<Header
				setWeb3={setWeb3}
				setProvider={setProvider}
				setContract={setContract}
			/>

			<Switch>
				<Route path="/" exact>
					<LandingPage />
				</Route>

				<Route path="/terms">
					<TermsAndConditions />
				</Route>
			</Switch>

			<Footer isMobile={isMobile} />
		</Router>
	);
}
