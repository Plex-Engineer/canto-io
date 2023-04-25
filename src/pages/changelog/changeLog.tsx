import styled from "@emotion/styled";
import LogSection from "./components/logSection";

const ChangeLog = () => {
  return (
    <Styled>
      <LogSection
        date="Apr 11th 2023"
        title="Fixes & Enhancements"
        content={`- Added bridging support for the 15 new cosmos tokens that recently passed governance.
        - Added the ability to initiate ibc transactions for supported tokens.
        - Updated the COH banner to S7.
        - Minor updates have been made to the UI styling on various pages.`}
      />
      <LogSection
        date="Mar 21st 2023"
        title="Fixes & Enhancements"
        content={`- Made improvements to the bridge to make the UX more intuitive.
        - Made general design updates to modals on various pages.
        - Added S6 dates to the COH banner.
        - Added new cosmos tokens to bridge.
        - Minor updates have been made to the UI styling on various pages.`}
      />
      <LogSection
        date="Feb 2nd 2023"
        title="Fixes & Enhancements"
        content={`- Added a link to the Canto Online Hackathon on the landing page.
        - An issue that resulted in a black screen when users entered decimal slippage on the LP interface is now fixed.
        - An issue that resulted in a black screen when users entered a decimal while removing liquidity on the LP interface is now fixed.
        - Made minor improvements to the bridge so that its more clear to users that bridging is a two step process.
        - Minor updates have been made to the UI styling on various pages.`}
      />
      <LogSection
        date="Jan 26th 2023"
        title="Fixes & Enhancements"
        content={`- Bridging assets into and out of Canto is now easier than ever with a new guided walkthrough. To use the walkthrough click the “Guide” button on the bridge page.
        - Updates have been made to the UI on various pages to fix issues with the mobile experience.
        - An issue that resulted in votes not appearing in proposals on the page until refreshing has now been fixed.
        - An issue where canto.io incorrectly displayed 0 as the ETH mainnet balance at times is now fixed.
        - The design of the proposal page has been changed to enhance readability.`}
      />
      <LogSection
        date="Jan 10th 2023"
        title="Fixes & Enhancements"
        content={`- An issue where in some cases failed Cosmo’s transactions were showing as successful in the UI is now fixed.
        - An issue where claiming rewards on the staking page resulted in a failed transaction if a user was staked to too many validators is now fixed.
        - An issue where supplying an LP token to the lending market would result in a failed transaction on the LP interface if a user did not have an allowance for the LP token is now fixed.
        - When a user selects the “max” option while staking, we now deduct the amount needed for gas from the amount being staked to ensure the transaction is successful.`}
      />
      <LogSection
        date="Jan 3rd 2023"
        title="Fixes & Enhancements"
        content={`- An issue that resulted in the LP interface & LM pages UI incorrectly displaying a completed transaction as being in progress is now fixed.
        - When bridging in users now see WETH instead of ETH when selecting a token.
        - If a user has not yet generated a Canto public key, the button for bridging is now disabled.`}
      />
      <LogSection
        date="Dec 27th 2022"
        title="Fixes & Enhancements"
        content={`- An issue where notifications for successful transactions were displayed in red instead of green is now fixed.
        - Minor updates have been made to the UI styling on various pages.
        - The rewards counter on the lending page now specifies accrued rewards as wCanto.
        - The Slingshot link on the LP interface page now opens in a new tab when clicked.
        - Closing the modal on the LP interface page before the second transaction populates will now trigger an alert notifying users they will need to supply LP tokens to the lending market manually.
        - A link to the previous version of the site has been added to the menu.
        - The "about canto" link in the footer now correctly directs to the Canto Blog.`}
      />
    </Styled>
  );
};

const Styled = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 0;
  /* overflow-y: scroll; */
  /* height: calc(100vh - 10rem); */
  position: relative;

  .section {
    display: flex;
    gap: 2rem;

    .header {
      position: sticky;
      height: min-content;
      min-width: 16rem;
      top: 5.5rem;
      background-color: #03ca7b34;
      padding: 1rem;
      border-bottom: 4px solid var(--primary-color);
    }
    .changes {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      margin-bottom: 6rem;
      p {
        line-height: 2rem;
      }
    }
  }

  @media (max-width: 1000px) {
    width: 100%;
    flex-direction: column;
    .section {
      flex-direction: column;
      .header {
        background-color: #014428;
        border-bottom: 4px solid var(--primary-color);
        position: sticky;
        /* top: 0; */
        top: 5rem;
        padding: 1rem;
        width: 100%;
        margin: 0;
      }
      .changes {
        padding: 0 2rem;
      }
    }
  }
`;

export default ChangeLog;
