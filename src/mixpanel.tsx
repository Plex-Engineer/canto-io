import { CantoTransactionType } from "global/config/transactionTypes";
import mixpanel from "mixpanel-browser";

mixpanel.init("f58419bff863911fa30164121332f571");

const actions = {
  track: (name: string, props: any) => {
    mixpanel.track(name, props);
  },
  identify: (id: string) => {
    mixpanel.identify(id);
  },
  alias: (id: string) => {
    mixpanel.alias(id);
  },
  people: {
    set: (props: any) => {
      mixpanel.people.set(props);
    },
  },
  events: {
    pageOpened: (pageName: string, account: string | undefined) => {
      mixpanel.track("Page Opened", {
        distinct_id: account ?? 0,
        pageName: pageName,
        wallet: account ?? 0,
      });
    },
    transactionStarted: (
      txType: CantoTransactionType,
      account: string | undefined,
      info: object | undefined
    ) => {
      mixpanel.track("Transaction Started", {
        distinct_id: account,
        wallet: account,
        txType: txType,
        ...info,
      });
    },
    landingPageActions: {
      navigatedTo: (pageName: string, account: string | undefined) => {
        mixpanel.track("Landing Page Navigated To", {
          distinct_id: account,
          pageName: pageName,
          wallet: account,
        });
      },
    },
    lendingMarketActions: {
      modalInteraction: (
        account: string,
        modalType: string,
        tokenName: string,
        opened: boolean
      ) => {
        if (opened) {
          mixpanel.track("Lending Modal Opened", {
            distinct_id: account,
            tokenName: tokenName,
            modalType: modalType,
            wallet: account,
          });
        } else {
          mixpanel.track("Lending Modal Closed", {
            distinct_id: account,
            tokenName: tokenName,
            modalType: modalType,
            wallet: account,
          });
        }
      },
    },
    lpInterfaceActions: {
      modalInteraction: (
        account: string | undefined,
        modalType: string,
        tokenName: string,
        opened: boolean
      ) => {
        if (opened) {
          mixpanel.track("LP Interface Modal Opened", {
            distinct_id: account,
            tokenName: tokenName,
            modalType: modalType,
            wallet: account,
          });
        } else {
          mixpanel.track("LP Interface Modal Closed", {
            distinct_id: account,
            tokenName: tokenName,
            modalType: modalType,
            wallet: account,
          });
        }
      },
      visitSlingshot: (account: string | undefined) => {
        mixpanel.track("Visit Slingshot", {
          distinct_id: account,
          wallet: account,
        });
      },
    },
    governanceActions: {
      openedStakingPage: (account: string | undefined) => {
        mixpanel.track("Visit Staking Page From Governance Page", {
          distinct_id: account,
          wallet: account,
        });
      },
      proposalOpened: (
        account: string | undefined,
        proposalId: string | undefined
      ) => {
        mixpanel.track("Proposal Opened", {
          distinct_id: account,
          wallet: account,
          proposalId: proposalId,
        });
      },
    },
    stakingActions: {
      modalInteraction: (
        account: string | undefined,
        validatorName: string,
        opened: boolean
      ) => {
        if (opened) {
          mixpanel.track("Staking Modal Opened", {
            distinct_id: account,
            wallet: account,
            validatorName: validatorName,
          });
        } else {
          mixpanel.track("Staking Modal Closed", {
            distinct_id: account,
            wallet: account,
            validatorName: validatorName,
          });
        }
      },
      userSearch: () => {
        mixpanel.track("Validators Searched");
      },
    },
    bridgeActions: {
      transactionPageOpened: () => {
        mixpanel.track("Bridge Transaction Page Opened");
      },
      viewBlockExplorer: (txType: string, status: string) => {
        mixpanel.track("Bridge View Block Explorer", {
          txType: txType,
          status: status,
        });
      },
    },
  },
};

export const Mixpanel = actions;
