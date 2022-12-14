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
  .options {
    z-index: 10;
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
    top: 0;
    left: 0;
    z-index: 0;
    opacity: 0.4;

    background: url(${bg}),
      linear-gradient(
        270deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0) 0.01%,
        rgba(255, 255, 255, 0.0086472) 6.67%,
        rgba(255, 255, 255, 0.03551) 13.33%,
        rgba(255, 255, 255, 0.051374) 15.62%,
        rgba(255, 255, 255, 0.0816599) 20%,
        rgba(255, 255, 255, 0.147411) 26.67%,
        rgba(255, 255, 255, 0.231775) 33.33%,
        rgba(255, 255, 255, 0.286522) 36.98%,
        rgba(255, 255, 255, 0.331884) 40%,
        rgba(255, 255, 255, 0.442691) 46.67%,
        rgba(255, 255, 255, 0.557309) 53.33%,
        rgba(255, 255, 255, 0.649071) 59.99%,
        rgba(255, 255, 255, 0.668116) 60%,
        rgba(255, 255, 255, 0.768225) 66.67%,
        rgba(255, 255, 255, 0.852589) 73.33%,
        rgba(255, 255, 255, 0.889574) 77.6%,
        rgba(255, 255, 255, 0.91834) 80%,
        rgba(255, 255, 255, 0.96449) 86.67%,
        rgba(255, 255, 255, 0.972045) 86.68%,
        rgba(255, 255, 255, 0.991353) 93.33%,
        #ffffff 100%
      );
    background-size: cover;
    background-position: 40%;
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
    transition: background-color 0.5s;
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
      transition: background-size 1s, background-color 1s;
    }
  }
`;
export default Homepage;
