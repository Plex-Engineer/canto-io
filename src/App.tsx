import "App.scss";
import styled from "@emotion/styled";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { GlobalStyle } from "./global/packages/src";
import { CantoNav } from "global/components/cantoNav";
import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Governance from "pages/governance/governance";
// import Dex from "pages/dexLP/Dex";
// import LendingMarket from "pages/lending/LendingMarket";
// import { BalanceSheet } from "pages/lending/balanceSheet/BalanceSheet";
import Footer from "global/components/nFooter";
// import Staking from "pages/staking/Staking";
// import BridgingPage from "pages/bridge/Bridging";
import { PAGES } from "global/config/pageList";
import Loading from "global/components/Loading";
// import Proposal from "pages/governance/proposal";
// import Landing from "pages/landing/Landing";

//Styling
const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 5rem);
  background-color: #111;
`;
//Lazy loading pages. will load in the required pages
const Bridging = lazy(() => import("pages/bridge/Bridging"));
const Dex = lazy(() => import("./pages/dexLP/Dex"));
const Staking = lazy(() => import("./pages/staking/Staking"));
const Landing = lazy(() => import("./pages/landing/Landing"));
const LendingMarket = lazy(() => import("./pages/lending/LendingMarket"));
const Governance = lazy(() => import("./pages/governance/governance"));
const Proposal = lazy(() => import("./pages/governance/proposal"));
const BalanceSheet = lazy(() =>
  import("pages/lending/balanceSheet/BalanceSheet").then((module) => {
    return {
      default: module.BalanceSheet,
    };
  })
);

function App() {
  return (
    <React.Fragment>
      <ToastContainer />

      <GlobalStyle />
      <Router>
        <Container className="App">
          <CantoNav />
          <div className="main-body">
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/" key={"home"} element={<Landing />} />
                <Route
                  path={PAGES.bridge.link}
                  key={"bridge"}
                  element={<Bridging />}
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
            </Suspense>
          </div>
          <Footer />
        </Container>
      </Router>
    </React.Fragment>
  );
}

export default App;
