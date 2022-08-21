import React from "react";

const OverallStatsContext = React.createContext<any>("");
const OverallStatsUpdateContext = React.createContext<any>("");
export function useOverallStats() {
  return React.useContext(OverallStatsContext);
}

export function useOverallStatsUpdate() {
    return React.useContext(OverallStatsUpdateContext);
  }
export default function OverallStatsProvider({ children }: any) {
  const [overallStats, setOverallStats] = React.useState(null);

  function updateOverallStats(OverallStats: any) {
    setOverallStats(OverallStats);
  }
  return (
    <OverallStatsContext.Provider value={[overallStats, setOverallStats]}>
        <OverallStatsUpdateContext.Provider value={updateOverallStats}>
      {children}
      </OverallStatsUpdateContext.Provider>
    </OverallStatsContext.Provider>
  );
}
