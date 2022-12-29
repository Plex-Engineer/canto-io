import { CantoTransactionType } from "global/config/transactionTypes";
import mixpanel, { Dict } from "mixpanel-browser";

mixpanel.init("f58419bff863911fa30164121332f571");

const actions = {
  track: (name: string, props: Dict | undefined) => {
    mixpanel.track(name, props);
  },
  identify: (id: string) => {
    mixpanel.identify(id);
  },
  alias: (id: string) => {
    mixpanel.alias(id);
  },
  people: {
    set: (props: Dict) => {
      mixpanel.people.set_once(props);
    },
    registerWallet: (account: string) => {
      mixpanel.register({ distinct_id: account, wallet: account });
    },
  },
  events: {
    pageOpened: (pageName: string) => {
      mixpanel.track("Page Opened", {
        pageName: pageName,
      });
    },
    transactions: {
      transactionStarted: (
        txType: CantoTransactionType,
        info: object | undefined
      ) => {
        mixpanel.track("Transaction Started", {
          txType: txType,
          ...info,
        });
      },
      transactionSuccess: (
        txType: CantoTransactionType,
        txHash: string | undefined,
        info: object | undefined
      ) => {
        mixpanel.track("Transaction Success", {
          txType: txType,
          txHash: txHash,
          ...info,
        });
      },
      transactionFailed: (
        txType: CantoTransactionType,
        txHash: string | undefined,
        errorReason: string,
        info: object | undefined
      ) => {
        mixpanel.track("Transaction Fail", {
          txType: txType,
          txHash: txHash,
          errorReason: errorReason,
          ...info,
        });
      },
    },
    connections: {
      walletConnect: (connected: boolean) => {
        if (connected) {
          mixpanel.track("Wallet Connected");
        } else {
          mixpanel.track("Wallet Disconnected");
        }
      },
    },
    loadingModal: {
      blockExplorerOpened: (txHash: string | undefined) => {
        mixpanel.track("Block Explorer Opened While Loading", {
          txHash: txHash,
        });
      },
    },
    landingPageActions: {
      navigatedTo: (pageName: string) => {
        mixpanel.track("Landing Page Navigated To", {
          pageName: pageName,
        });
      },
    },
    lendingMarketActions: {
      modalInteraction: (
        modalType: string,
        tokenName: string,
        opened: boolean
      ) => {
        if (opened) {
          mixpanel.track("Lending Modal Opened", {
            tokenName: tokenName,
            modalType: modalType,
          });
        } else {
          mixpanel.track("Lending Modal Closed", {
            tokenName: tokenName,
            modalType: modalType,
          });
        }
      },
    },
    lpInterfaceActions: {
      modalInteraction: (
        modalType: string,
        tokenName: string,
        opened: boolean
      ) => {
        if (opened) {
          mixpanel.track("LP Interface Modal Opened", {
            tokenName: tokenName,
            modalType: modalType,
          });
        } else {
          mixpanel.track("LP Interface Modal Closed", {
            tokenName: tokenName,
            modalType: modalType,
          });
        }
      },
      visitSlingshot: () => {
        mixpanel.track("Visit Slingshot");
      },
    },
    governanceActions: {
      openedStakingPage: () => {
        mixpanel.track("Visit Staking Page From Governance Page");
      },
      proposalOpened: (proposalId: string | undefined) => {
        mixpanel.track("Proposal Opened", {
          proposalId: proposalId,
        });
      },
    },
    stakingActions: {
      modalInteraction: (validatorName: string, opened: boolean) => {
        if (opened) {
          mixpanel.track("Staking Modal Opened", {
            validatorName: validatorName,
          });
        } else {
          mixpanel.track("Staking Modal Closed", {
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
      checklistActions: {
        checklistOpened: () => {
          mixpanel.track("Bridge Checklist Opened");
        },
        checklistClosed: () => {
          mixpanel.track("Bridge Checklist Closed");
        },
        transactionAdded: () => {
          mixpanel.track("Bridge Checklist Transaction Added");
        },
        transactionRemoved: () => {
          mixpanel.track("Bridge Checklist Transaction Removed");
        },
      },
    },
  },
};

export const Mixpanel = actions;
