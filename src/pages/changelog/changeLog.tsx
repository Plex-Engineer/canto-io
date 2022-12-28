import styled from "@emotion/styled";
import LogSection from "./components/logSection";

const ChangeLog = () => {
  return (
    <Styled>
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
  &::-webkit-scrollbar {
    display: none;
  }

  & {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
  .section {
    display: flex;
    gap: 2rem;

    .header {
      position: sticky;
      height: min-content;
      width: 50%;
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
