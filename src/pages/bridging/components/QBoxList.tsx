import styled from "@emotion/styled";
import { Text } from "global/packages/src";
import QBox from "./QBox";

interface Props {
  QA: {
    question: string;
    answer: string;
  }[];
}

const QBoxList = ({ QA }: Props) => {
  return (
    <Styled>
      <div
        style={{
          width: "100%",
          padding: "4rem 1rem 0",
        }}
      >
        <Text type="title" align="left">
          F.A.Q
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
  width: 100%;
  justify-self: flex-start;
  align-items: center;
  gap: 1rem;
  height: 100%;

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
