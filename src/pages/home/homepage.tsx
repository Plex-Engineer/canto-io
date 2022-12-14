import styled from "@emotion/styled";
import HelmetSEO from "global/components/seo";
import { pageList } from "global/config/pageList";
import { Text } from "global/packages/src";
import { useNetworkInfo } from "global/stores/networkInfo";
import { Mixpanel } from "mixpanel";
import { NavLink } from "react-router-dom";
import bg from "assets/bg.jpg";

const Homepage = () => {
  const account = useNetworkInfo().account;

  return (
    <>
      <HelmetSEO
        title="Canto - Home Page"
        description="Canto Homepage serves De-fi applications"
        link=""
      />
      <Styled>
        <ul className="options" id="routes">
          {pageList.map((page, idx) => {
            return (
              <NavLink
                to={page.link}
                key={page.name}
                id={page.name}
                onClick={() =>
                  Mixpanel.events.landingPageActions.navigatedTo(
                    page.name,
                    account
                  )
                }
              >
                <Text type="title" size="title1" align="left">
                  {"0" + (idx + 1) + " " + page.name}
                </Text>
              </NavLink>
            );
          })}
        </ul>
        <div className="bg"> </div>
      </Styled>
    </>
  );
};
const Styled = styled.div`
  display: grid;
  align-content: center;
  height: 100%;
  z-index: 0;
  .options {
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-grow: 2;
    margin-left: 6rem;
  }
  .bg {
    position: absolute;
    height: 100vh;
    width: 100vw;
    background-color: black;
    background: url(${bg}),
      linear-gradient(90deg, rgba(0, 0, 0, 1) 40%, rgba(0, 0, 0, 0) 60%),
      linear-gradient(180deg, #06fc99 0%, #06fc99 50%, rgba(0, 0, 0, 1) 100%);
    background-position: 100%;
    background-size: contain;
    top: 0;
    background-repeat: no-repeat;

    &::after {
      content: " ";
      position: absolute;
      height: 100vh;
      width: 100vw;
      background: linear-gradient(
        90deg,
        #00000015,
        #000000b9,
        #00000013,
        #000000c0
      );
      background-size: 200% 200%;
      animation: movingFade 10s ease infinite;
      @keyframes movingFade {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }
    }
  }

  a {
    width: 32rem;
  }

  p {
    height: 68px;
    transition: all 0.3s ease;
    width: 100%;
    padding-left: 1rem;
    border-radius: 4px;
    transition: background-color 0.6s ease-in;
    transition: transform 0.3s ease-in-out;
    background-color: transparent;
    background-size: 0% 100%;
    &:hover {
      color: black;
      background-image: linear-gradient(
        to right,
        #06fc99 0%,
        #06fc99 40%,
        #06fc99 100%
      );
      background-repeat: no-repeat;
      background-size: 200% 100%;
      transition: background-size 0.7s, background-color 0.7s;
      transform: scale(1.1);
    }
  }
`;
export default Homepage;
