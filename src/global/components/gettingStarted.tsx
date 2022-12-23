import styled from "@emotion/styled";
import { OutlinedButton, PrimaryButton, Text } from "global/packages/src";
import dotImg from "assets/icons/dot.svg";
import DotsIndicator from "./dotsIndicator";
import { useState } from "react";
import sampleGettingStarted from "assets/sample-getstart.jpg";

const GettingStarted = () => {
  const [currentPage, setCurrentPage] = useState(0);

  function prevPage() {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  }
  function nextPage() {
    if (currentPage < 4) setCurrentPage(currentPage + 1);
  }
  return (
    <Styled>
      <Text type="title">Getting Started with lending</Text>
      <img
        className="hero"
        src={sampleGettingStarted}
        alt=""
        height={200}
        width={"100%"}
      />
      <Text type="text">
        click enable to set an allowance of the token on canto network
      </Text>
      <div className="grp">
        <div className="btn-grp">
          <OutlinedButton height="normal" onClick={prevPage}>
            Prev
          </OutlinedButton>
          <PrimaryButton height="normal" onClick={nextPage}>
            Next
          </PrimaryButton>
        </div>

        <DotsIndicator total={5} current={currentPage} />
        <div className="empty"></div>
      </div>
    </Styled>
  );
};

const Styled = styled.div`
  height: 450px;
  width: 600px;
  background-color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 4rem;
  justify-content: space-between;

  .hero {
    border: 1px solid var(--primary-color);
    object-fit: cover;
  }
  .btn-grp {
    display: flex;
    gap: 1rem;
  }

  .grp {
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
    gap: 3rem;
    flex-direction: row-reverse;
    & > * {
      flex: 1;
    }
  }
`;
export default GettingStarted;
