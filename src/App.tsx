import "App.scss";
import styled from "@emotion/styled";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import {
  ADDRESSES,
  GlobalStyle,
  Overlay,
  ScanLine,
  ScanlinesOverlay,
  StaticNoiseOverlay,
} from "./global/packages/src";

import { CantoNav } from "global/components/cantoNav";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Governance from "pages/governance/governance";
import Dex from "pages/dexLP/Dex";
import LendingMarket from "pages/lending/LendingMarket";
import Staking from "pages/staking/Staking";
import { BalanceSheet } from "pages/lending/balanceSheet/BalanceSheet";
import BridgingPage from "pages/bridge/Bridging";
import { useCoingeckoTokenPrice } from "@usedapp/coingecko";
import Footer from "global/components/nFooter";
// import landing from "pages/landing_page/index.html"

//Styling
const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #111;
  text-shadow: 0 0 4px #2cffab, 0 0 20px var(--primary-color);
`;

function App() {
  // const CantoPrice = useCoingeckoTokenPrice(ADDRESSES.cantoMainnet.WCANTO, "usd", "canto");
  return (
    <React.Fragment>
      <ToastContainer />
      <StaticNoiseOverlay />
      <ScanlinesOverlay />
      <ScanLine />
      <Overlay />
      <GlobalStyle />

      <Router>
        <Container className="App">
          <CantoNav />
          <Routes>
            <Route path="/bridge" key={"bridge"} element={<BridgingPage />} />
            <Route
              path="/governance"
              key="governance"
              element={<Governance />}
            />
            <Route path="/lp" key="lp interface" element={<Dex />} />
            <Route path="/lending" key="lending" element={<LendingMarket />} />
            <Route
              path="/lending/balanceSheet"
              key={"balanceSheet"}
              element={<BalanceSheet />}
            />
            <Route path="/staking" key={"staking"} element={<Staking />} />
          </Routes>
        </Container>
        <Footer />
      </Router>
    </React.Fragment>
  );
}

export default App;
