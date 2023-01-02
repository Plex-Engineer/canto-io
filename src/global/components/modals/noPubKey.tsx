import { useNetworkInfo } from "global/stores/networkInfo";
import GettingStarted from "../gettingStarted";
import sampleGettingStarted from "assets/sample-getstart.jpg";

export const NoPubKey = () => {
  const networkInfo = useNetworkInfo();
  return (
    <GettingStarted
      showHandle={!networkInfo.hasPubKey}
      pages={[
        {
          image: sampleGettingStarted,
          text: "sample page 1",
          handlePosition: { x: 48, y: 62 },
        },
        {
          image: sampleGettingStarted,
          text: "sample page 2",
          handlePosition: { x: 60, y: 30 },
        },
        {
          image: sampleGettingStarted,
          text: "sample page 3",
          handlePosition: { x: 40, y: 33 },
        },
        {
          image: sampleGettingStarted,
          text: "sample page 4",
          handlePosition: { x: 56, y: 60 },
        },
        {
          image: sampleGettingStarted,
          text: "sample page 5",
          handlePosition: { x: 85, y: 26 },
        },
      ]}
    />
  );
};
