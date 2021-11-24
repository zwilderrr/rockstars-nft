import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Footer } from "./Components/Footer";
import Header from "./Components/Header";
import LandingPage from "./Components/LandingPage";
import { TermsAndConditions } from "./Components/TermsAndConditions";
import "./App.css";

export default function App() {
	const [web3, setWeb3] = useState();
	const [provider, setProvider] = useState();
	const [Contract, setContract] = useState();
	const [shrinkHeader, setShrinkHeader] = useState(false);
	const isMobile = window.screen.width <= 768;

	return (
		<Router>
			<Header
				setWeb3={setWeb3}
				setProvider={setProvider}
				setContract={setContract}
				shrink={shrinkHeader}
			/>

			<Switch>
				<Route path="/" exact>
					<LandingPage
						web3={web3}
						provider={provider}
						Contract={Contract}
						isMobile={isMobile}
						setShrinkHeader={setShrinkHeader}
					/>
				</Route>

				<Route path="/terms">
					<TermsAndConditions setShrinkHeader={setShrinkHeader} />
				</Route>
			</Switch>

			<Footer isMobile={isMobile} />
		</Router>
	);
}
