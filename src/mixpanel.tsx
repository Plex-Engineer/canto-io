import mixpanel from 'mixpanel-browser';



mixpanel.init('f58419bff863911fa30164121332f571');

let actions = {
    track: (name: string , props: any) => {
        mixpanel.track(name,props);
    },
    identify: (id: string) => {
        mixpanel.identify(id);
    },
    alias: (id:string) => {
        mixpanel.alias(id);
    },
    people: {
        set: (props: any) => {
            mixpanel.people.set(props);
        }
    },
    events: {
        pageOpened: (pageName: string, walletAddress: string | undefined) => {
            mixpanel.track('Page Opened', {
                distinct_id: walletAddress ? walletAddress : 0,
                pageName: pageName
            })
        },
        lendingMarketActions: {
            supply: (walletAddress: string, tokenName: string, tokenAmount: string, NoteAmount: string) => {
                mixpanel.track('Token Supply', {
                    distinct_id: walletAddress,
                    tokenName: tokenName,
                    tokenAmount: tokenAmount,
                    NoteAmount: NoteAmount 
                })
            },
            borrow: (walletAddress: string, tokenName: string, tokenAmount: string, NoteAmount: string) => {
                mixpanel.track('Token Borrow', {
                    distinct_id: walletAddress,
                    tokenName: tokenName,
                    tokenAmount: tokenAmount,
                    NoteAmount: NoteAmount 
                })
            },
            withdraw: (walletAddress: string, tokenName: string, tokenAmount: string, NoteAmount: string) => {
                mixpanel.track('Token Withdraw', {
                    distinct_id: walletAddress,
                    tokenName: tokenName,
                    tokenAmount: tokenAmount,
                    NoteAmount: NoteAmount 
                })
            },
            repay: (walletAddress: string, tokenName: string, tokenAmount: string, NoteAmount: string) => {
                mixpanel.track('Token Repay', {
                    distinct_id: walletAddress,
                    tokenName: tokenName,
                    tokenAmount: tokenAmount,
                    NoteAmount: NoteAmount 
                })
            },
            collateralization: (walletAddress: string, tokenName: string) => {
                mixpanel.track('Token Collateralization', {
                    distinct_id: walletAddress, 
                    tokenName: tokenName
                })
            },
            decollateralization: (walletAddress: string, tokenName: string) => {
                mixpanel.track('Token Decollateralization', {
                    distinct_id: walletAddress, 
                    tokenName: tokenName
                })
            },
            modalInteraction: (walletAddress: string, modalType: string, tokenName: string, opened: boolean) => {
                if (opened) {
                    mixpanel.track('Modal Opened', {
                        distinct_id: walletAddress,
                        tokenName: tokenName,
                        modalType: modalType
                    })
                } else {
                    mixpanel.track('Modal Closed', {
                        distinct_id: walletAddress,
                        tokenName: tokenName,
                        modalType: modalType
                    })
                }
            }
        }
    }
    
};

export let Mixpanel = actions;