import styled from "@emotion/styled";
import { OutlinedButton, Text } from "global/packages/src";
import bannerImg from "assets/coh-banner.png";
export const Banner = () => {
  return (
    <Styled>
      <Text type="title" size="title2" align="left">
        The canto online hackathon
      </Text>
      <Text align="left">/chapter 1 : season 7</Text>
      <Text align="left">/april 20 - may 7</Text>
      <Text align="left">
        Join the Canto Online Hackathon for apps, infrastructure, and original
        work.
      </Text>
      <div className="spacer"></div>
      <OutlinedButton
        onClick={() => {
          window.open("https://thecoh.build/");
        }}
      >
        Apply to hack &gt;
      </OutlinedButton>
    </Styled>
  );
};

const Styled = styled.div`
  width: 400px;
  height: 500px;
  border-radius: 4px;
  padding: 1rem;
  border: 1px solid #06fc99b8;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-image: url(${bannerImg});
  background-size: cover;
  .spacer {
    flex-grow: 1;
  }
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.02);
  }

  @media (max-width: 1000px) {
    width: 100%;
    margin: 0 1.4rem;
  }
`;
