/*
  THRESHOLDS
  40% for quorum (vote to even make proposal valid)
  50% for threshold (enough to make pass, of participating voting power)
  <33.4% for veto (more than 33.4% of voting participants vote nowithveto will veto)

*/

export const votingThresholds = {
    quorum: "40%",
    threshold: "50%",
    veto: "33.4%"
}