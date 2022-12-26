import styled from "@emotion/styled";
import { OutlinedButton, PrimaryButton, Text } from "global/packages/src";
import DotsIndicator from "./dotsIndicator";
import { useRef, useState } from "react";
import cursorImg from "assets/icons/Cursor.svg";
import { StyledPopup } from "./Styled";

interface Page {
  image: string;
  text: string;
  handlePosition: {
    x?: number;
    y?: number;
  };
}

interface Props {
  pages: Array<Page>;
  showHandle?: boolean;
}
const GettingStarted = ({ pages, showHandle }: Props) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [fade, setFade] = useState(false);
  const [open, setOpen] = useState(true);
  function prevPage() {
    if (!(currentPage > 0)) return;
    setCurrentPage(currentPage - 1);
    setFade(true);
  }
  function nextPage() {
    if (!(currentPage < 4)) {
      setOpen(false);
      return;
    }
    setCurrentPage(currentPage + 1);
    setFade(true);
  }
  return (
    <StyledPopup open={open}>
      <Styled>
        <div className="cursor-handler">
          <img
            src={cursorImg}
            alt="cursor"
            style={{
              display: showHandle ? "block" : "none",
              top: pages[currentPage].handlePosition.y + "%",
              left: pages[currentPage].handlePosition.x + "%",
            }}
          />
        </div>
        <Text type="title">Getting Started with lending</Text>
        <img
          className={fade ? "hero fade" : "hero"}
          onAnimationEnd={() => {
            setFade(false);
          }}
          src={pages[currentPage].image}
          alt="image"
          height={200}
          width={"100%"}
        />
        <Text type="text">{pages[currentPage].text}</Text>
        <div className="grp">
          <div className="btn-grp">
            <OutlinedButton
              height="normal"
              onClick={prevPage}
              disabled={currentPage == 0}
              weight="bold"
            >
              Prev
            </OutlinedButton>
            <PrimaryButton height="normal" onClick={nextPage} weight="bold">
              {currentPage == pages.length - 1 ? "Done" : "Next"}
            </PrimaryButton>
          </div>

          <DotsIndicator total={pages.length} current={currentPage} />
          <div className="empty"></div>
        </div>
      </Styled>
    </StyledPopup>
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

  .cursor-handler {
    img {
      position: absolute;
      top: 0;
      left: 0;
      transition: all 0.4s;
    }
  }
  .hero {
    border: 1px solid var(--primary-color);
    object-fit: cover;
  }

  .fade {
    /* animation: crossFade 0.4s linear; */
    @keyframes crossFade {
      0% {
        opacity: 1;
      }
      50% {
        opacity: 0.8;
      }
      100% {
        opacity: 1;
      }
    }
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
