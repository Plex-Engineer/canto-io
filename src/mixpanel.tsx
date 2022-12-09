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
      mixpanel.people.set(props);
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
      transactionSuccess: (
        txType: CantoTransactionType,
        account: string | undefined,
        txHash: string | undefined,
        info: object | undefined
      ) => {
        mixpanel.track("Transaction Success", {
          distinct_id: account,
          wallet: account,
          txType: txType,
          txHash: txHash,
          ...info,
        });
      },
      transactionFailed: (
        txType: CantoTransactionType,
        account: string | undefined,
        txHash: string | undefined,
        errorReason: string,
        info: object | undefined
      ) => {
        mixpanel.track("Transaction Fail", {
          distinct_id: account,
          wallet: account,
          txType: txType,
          txHash: txHash,
          errorReason: errorReason,
          ...info,
        });
      },
    },
    connections: {
      walletConnect: (account: string | undefined, connected: boolean) => {
        if (connected) {
          mixpanel.track("Wallet Connected", {
            distinct_id: account,
            wallet: account,
          });
        } else {
          mixpanel.track("Wallet Disconnected", {
            distinct_id: account,
            wallet: account,
          });
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
