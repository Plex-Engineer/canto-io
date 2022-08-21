import "App.css";
import styled from "@emotion/styled";
import BridgePage from "pages/bridge/bridge";
import "react-toastify/dist/ReactToastify.css";
import {ToastContainer } from "react-toastify";
import { Overlay, ScanLine, ScanlinesOverlay, StaticNoiseOverlay } from "cantoui"
import { CantoNav } from "global/components/cantoNav";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Governance from "pages/governance/governance";
import Dex from "pages/dexLP/Dex";
import LendingMarket from "pages/lending/LendingMarket";


//Styling
const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #111;
  text-shadow: 0 0 4px #2cffab, 0 0 20px var(--primary-color);
`;


function App() {

  return (
    <React.Fragment>
      <ToastContainer />
      <Router>
      <StaticNoiseOverlay/>
      <ScanlinesOverlay />
      <ScanLine/>
      <Overlay/>
      <Container className="App">
      <CantoNav/>
        <Routes>
            <Route path="/" element={<BridgePage />} />
            <Route path="/governance" element={<Governance />} />
            <Route path="/lpinterface" element={<Dex />} />
            <Route path="/lending" element={<LendingMarket />} />
        </Routes>
      </Container>
      </Router>
    </React.Fragment>
  );
}

export default App;
