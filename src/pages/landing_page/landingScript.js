import { PAGES } from "global/config/pageList";
import { Mixpanel } from "mixpanel";

export function openLink(input, account) {
  const [link, name] = getLink(input);
  if (!link) {
    document.querySelector("#error").style.display = "block";
    setTimeout(() => {
      document.querySelector("#error").style.display = "none";
    }, 3000);
  } else {
    Mixpanel.events.landingPageActions.navigatedTo(name, account);
    window.open(link, "_self");
  }
}

export function getLink(input) {
  switch (input) {
    case "0":
      return [PAGES.bridge.link, PAGES.bridge.name];
    case "1":
      return [PAGES.staking.link, PAGES.staking.name];
    case "2":
      return [PAGES.lp.link, PAGES.lp.name];
    case "3":
      return [PAGES.lending.link, PAGES.lending.name];
    case "4":
      return [PAGES.governance.link, PAGES.governance.name];
    case "7":
      return ["https://canto.gitbook.io/canto/overview/about-canto", "about"];
    default:
      return ["", ""];
  }
}
