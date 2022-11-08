import "App.scss";
import styled from "@emotion/styled";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { GlobalStyle } from "./global/packages/src";
import { CantoNav } from "global/components/cantoNav";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Governance from "pages/governance/governance";
import Dex from "pages/dexLP/Dex";
import LendingMarket from "pages/lending/LendingMarket";
import { BalanceSheet } from "pages/lending/balanceSheet/BalanceSheet";
import { useCoingeckoTokenPrice } from "@usedapp/coingecko";
import Footer from "global/components/nFooter";
import Staking from "pages/staking/Staking";
import LandingPage from "pages/landing_page/LandingPage";
import BridgingPage from "pages/bridge/Bridging";
import { PAGES } from "global/config/pageList";
import Proposal from "pages/governance/proposal";
//Styling
const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 5rem);
  background-color: #111;
`;

function App() {
  // const CantoPrice = useCoingeckoTokenPrice(ADDRESSES.cantoMainnet.WCANTO, "usd", "canto");
  return (
    <React.Fragment>
      <ToastContainer />
      {/* <StaticNoiseOverlay /> */}
      {/* <ScanlinesOverlay /> */}
      {/* <ScanLine /> */}
      {/* <Overlay /> */}
      <GlobalStyle />

      <Router>
        <Container className="App">
          <CantoNav />
          <div className="main-body">
            <Routes>
              <Route path="/" key={"home"} element={<LandingPage />} />
              <Route
                path={PAGES.bridge.link}
                key={"bridge"}
                element={<BridgingPage />}
              />
              <Route
                path={PAGES.governance.link}
                key="governance"
                element={<Governance />}
              />
              <Route
                path={PAGES.governance.subpages.proposal.link}
                key="governance-proposal"
                element={<Proposal />}
              />
              <Route
                path={PAGES.lp.link}
                key="lp interface"
                element={<Dex />}
              />
              <Route
                path={PAGES.lending.link}
                key="lending"
                element={<LendingMarket />}
              />
              <Route
                path={PAGES.staking.link}
                key={"staking"}
                element={<Staking />}
              />
              <Route
                path="/lending/balanceSheet"
                key={"balanceSheet"}
                element={<BalanceSheet />}
              />
            </Routes>
          </div>
          <Footer />
        </Container>
      </Router>
    </React.Fragment>
  );
}

export default App;
