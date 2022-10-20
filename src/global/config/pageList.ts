import { CantoMainnet, CantoTestnet } from "global/config/networks";
import { BigNumber } from "ethers";
import { parseUnits } from "ethers/lib/utils";

export const PAGES = {
  bridge: {
    name: "bridge",
    link: "/bridge",
    pageTitle: "bridge",
    networks: [CantoMainnet.chainId, CantoTestnet.chainId, 1],
  },
  governance: {
    name: "governance",
    link: "/governance",
    pageTitle: "governance",
    networks: [CantoMainnet.chainId, CantoTestnet.chainId],
  },
  lending: {
    name: "lending",
    link: "/lending",
    pageTitle: "lending",
    networks: [CantoMainnet.chainId, CantoTestnet.chainId],
  },
  lp: {
    name: "lp interface",
    link: "/lp",
    pageTitle: "lp interface",
    networks: [CantoMainnet.chainId, CantoTestnet.chainId],
  },
  staking: {
    name: "staking",
    link: "/staking",
    pageTitle: "staking",
    networks: [CantoMainnet.chainId, CantoTestnet.chainId],
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
  networks: number[];
  balanceLimits?: BalanceLimits[];
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
  },
  {
    name: PAGES.governance.name,
    link: PAGES.governance.link,
    pageTitle: PAGES.governance.pageTitle,
    networks: PAGES.governance.networks,
  },
  {
    name: PAGES.lending.name,
    link: PAGES.lending.link,
    pageTitle: PAGES.lending.pageTitle,
    networks: PAGES.lending.networks,
  },
  {
    name: PAGES.lp.name,
    link: PAGES.lp.link,
    pageTitle: PAGES.lp.pageTitle,
    networks: PAGES.lp.networks,
  },
  {
    name: PAGES.staking.name,
    link: PAGES.staking.link,
    pageTitle: PAGES.staking.pageTitle,
    networks: PAGES.staking.networks,
    balanceLimits: PAGES.staking.balanceLimits,
  },
];
