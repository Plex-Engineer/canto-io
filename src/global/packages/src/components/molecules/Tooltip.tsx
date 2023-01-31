import styled from "@emotion/styled";
import { ReactNode, useEffect, useState } from "react";
import Popup from "reactjs-popup";

interface Props {
  content: ReactNode;
  trigger: JSX.Element;
  position?: PopupPosition;
  autoShow?: boolean;
}

export declare type PopupPosition =
  | "top left"
  | "top center"
  | "top right"
  | "right top"
  | "right center"
  | "right bottom"
  | "bottom left"
  | "bottom center"
  | "bottom right"
  | "left top"
  | "left center"
  | "left bottom"
  | "center center";

const Tooltip = (props: Props) => {
  const [isDone, setIsDone] = useState(false);
  useEffect(() => {
    if (props.autoShow) {
      setTimeout(() => {
        setIsDone(true);
      }, 5000);
    }
  }, []);

  return (
    <Popup
      trigger={props.trigger}
      open={!isDone}
      position={props.position ? props.position : "bottom center"}
      on={["hover", "focus"]}
      arrow={true}
      arrowStyle={{
        color: "rgba(217, 217, 217, 0.25)",
        backdropFilter: "blur(35px)",
      }}
    >
      <Styled>{props.content}</Styled>
    </Popup>
  );
};
const Styled = styled.div`
  background: rgba(217, 217, 217, 0.2);
  backdrop-filter: blur(35px);
  border-radius: 4px;
  padding: 8px 12px;
  color: white;
`;
export default Tooltip;
