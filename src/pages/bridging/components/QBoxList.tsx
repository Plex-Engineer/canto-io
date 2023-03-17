import styled from "@emotion/styled";
import { Text } from "global/packages/src";
import { ReactNode } from "react";
import QBox from "./QBox";

interface Props {
  QA: {
    question: string;
    answer: ReactNode;
  }[];
  title: string;
}

const QBoxList = ({ QA, title }: Props) => {
  return (
    <Styled>
      <div
        style={{
          width: "100%",
          paddingTop: "1rem",
        }}
      >
        <Text type="title" align="left">
          {title}
        </Text>
      </div>
      {QA.map((qa, idx) => (
        <QBox key={idx} question={qa.question} answer={qa.answer} />
      ))}
    </Styled>
  );
};

const Styled = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% - 2rem);
  justify-self: flex-start;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  gap: 1rem;
  /* height: 100%; */

  .noselect {
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Old versions of Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
  }
`;

export default QBoxList;
