import { CantoMainnet, CantoTestnet } from "global/config/networks";
import { BigNumber } from "ethers";
import { parseUnits } from "ethers/lib/utils";

export const PAGES = {
  landing_page: {
    name: "landing page",
    link: "/",
    pageTitle: "home",
    networks: [],
    showInMenu: false,
    walletNotRequired: true,
  },
  bridge: {
    name: "bridge",
    link: "/bridge",
    pageTitle: "bridge",
    networks: [CantoMainnet.chainId, CantoTestnet.chainId, 1],
    showInMenu: true,
    balanceLimits: [
      {
        minBalance: parseUnits("2.5", 18),
        description: "bridge",
        warningMessage:
          "you may not have enough CANTO to complete all bridging actions, we recommend at least 2.5 CANTO to avoid transaction failure",
      },
    ],
    subPages: {
      walkthrough: {
        name: "walkthrough",
        link: "/bridge/walkthrough",
        pageTitle: "guide",
        networks: [CantoMainnet.chainId, CantoTestnet.chainId, 1],
        showInMenu: false,
      },
    },
  },
  governance: {
    name: "governance",
    link: "/governance",
    pageTitle: "governance",
    networks: [CantoMainnet.chainId, CantoTestnet.chainId],
    showInMenu: true,
    subpages: {
      proposal: {
        name: "proposal",
        link: "/governance/proposal/:id",
        pageTitle: "proposal #0",
        pageTitleFunction: (link: string) => {
          return "proposal #" + link.split("/")[3];
        },
        networks: [CantoMainnet.chainId, CantoTestnet.chainId],
        showInMenu: false,
      },
    },
  },
  lending: {
    name: "lending",
    link: "/lending",
    pageTitle: "lending",
    networks: [CantoMainnet.chainId, CantoTestnet.chainId],
    showInMenu: true,
  },
  lp: {
    name: "lp interface",
    link: "/lp",
    pageTitle: "lp interface",
    networks: [CantoMainnet.chainId, CantoTestnet.chainId],
    showInMenu: true,
  },
  changelog: {
    name: "change log",
    link: "/changelog",
    pageTitle: "change log",
    networks: [],
    showInMenu: false,
    walletNotRequired: true,
  },
  staking: {
    name: "staking",
    link: "/staking",
    pageTitle: "staking",
    networks: [CantoMainnet.chainId, CantoTestnet.chainId],
    showInMenu: true,
    balanceLimits: [
      {
        minBalance: parseUnits("3.5", 18),
        description: "claim rewards",
        warningMessage:
          "you may not have enough CANTO to claim rewards, we recommend at least 3.5 CANTO to avoid transaction failure",
      },
    ],
  },
};
export interface PageObject {
  name: string;
  link: string;
  pageTitle: string;
  pageTitleFunction?: (link: string) => string;
  networks: number[];
  showInMenu: boolean;
  balanceLimits?: BalanceLimits[];
  subpages?: PageObject[];
  walletNotRequired?: boolean;
}
interface BalanceLimits {
  minBalance: BigNumber;
  description: string;
  warningMessage: string;
}

export const pageList: PageObject[] = [
  {
    name: PAGES.bridge.name,
    link: PAGES.bridge.link,
    pageTitle: PAGES.bridge.pageTitle,
    networks: PAGES.bridge.networks,
    showInMenu: PAGES.bridge.showInMenu,
    balanceLimits: PAGES.bridge.balanceLimits,
    subpages: [PAGES.bridge.subPages.walkthrough],
  },
  {
    name: PAGES.staking.name,
    link: PAGES.staking.link,
    pageTitle: PAGES.staking.pageTitle,
    networks: PAGES.staking.networks,
    showInMenu: PAGES.staking.showInMenu,
    balanceLimits: PAGES.staking.balanceLimits,
  },
  {
    name: PAGES.lp.name,
    link: PAGES.lp.link,
    pageTitle: PAGES.lp.pageTitle,
    networks: PAGES.lp.networks,
    showInMenu: PAGES.lp.showInMenu,
  },
  {
    name: PAGES.lending.name,
    link: PAGES.lending.link,
    pageTitle: PAGES.lending.pageTitle,
    networks: PAGES.lending.networks,
    showInMenu: PAGES.lending.showInMenu,
  },
  {
    name: PAGES.governance.name,
    link: PAGES.governance.link,
    pageTitle: PAGES.governance.pageTitle,
    networks: PAGES.governance.networks,
    showInMenu: PAGES.governance.showInMenu,
    subpages: [PAGES.governance.subpages.proposal],
  },
  {
    name: PAGES.changelog.name,
    link: PAGES.changelog.link,
    pageTitle: PAGES.changelog.pageTitle,
    networks: PAGES.changelog.networks,
    showInMenu: PAGES.changelog.showInMenu,
    walletNotRequired: PAGES.changelog.walletNotRequired,
  },
  {
    name: PAGES.landing_page.name,
    link: PAGES.landing_page.link,
    pageTitle: "",
    networks: PAGES.landing_page.networks,
    showInMenu: false,
    walletNotRequired: PAGES.landing_page.walletNotRequired,
  },
];
