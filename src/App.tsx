import "App.css";
import styled from "@emotion/styled";
import { HelmetProvider } from "react-helmet-async";
import BridgePage from "pages/bridge";
import "react-toastify/dist/ReactToastify.css";
import {ToastContainer } from "react-toastify";
import { Overlay, ScanLine, ScanlinesOverlay, StaticNoiseOverlay } from "cantoui"
import { CantoNav } from "global/components/cantoNav";


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
    <HelmetProvider>
      <ToastContainer />
      <StaticNoiseOverlay/>
      <ScanlinesOverlay />
      <ScanLine/>
      <Overlay/>
      <Container className="App">
      <CantoNav/>
      <BridgePage />
      </Container>
    </HelmetProvider>
  );
}

export default App;
