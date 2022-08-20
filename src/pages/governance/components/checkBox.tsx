import { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  background-color: #040404;
  display: flex;
  align-items: center;
  justify-content: start;
  width: 100%;
 

  .selected {
    background: rgba(6, 252, 153, 0.15);
    border-radius: 1px;
    color: var(--primary-color);
  }

  .voteForm {
    border: 1px solid #222;
    padding: 1rem;
    width: 100%;
    div {
      padding: 2rem;
      width: 100%;
    }
  }
`;


interface checkProps {
    values : string[];
    onChange : (value : string)=>void
}

const CheckBox = ({values, onChange} : checkProps) => {
  const [option, setOption] = useState("none");

  const handleChange = (value: string) => {
    setOption(value);
  };

  
  return (
    <Container>
        {
            values.map((value)=>{
                return <GovRadioButton
                key={value}
                selected={option === value}
                name={value}
                onChange={(val)=>{
                    onChange(val);
                    handleChange(val);
                }}
              />
            })
        }
    

    </Container>
  );
};
interface radioProps {
  name: string;
  selected: boolean;
  onChange: (value: string) => void;
}

const GovRadioStyle = styled.div`
  padding: 1rem;
  border: 1px solid transparent;
  width: 100%;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  transition: all 0.4s;
  justify-content: center;
  align-items: center;
  color: white;
  border: 1px solid #222;
  /* margin-top: -1px; */

  &:hover,
  &.active {
    border: 1px solid var(--primary-color);
    color: var(--primary-color);
    background-color: #06fc9a1d;
    .unchecked {
      border: 1px solid var(--primary-color);

    }
  }

  .unchecked {
    border: 1px solid white;
    height: 20px;
    width: 20px;
    border-radius: 50%;
  }

  .checked {
    margin: 4px;
    height: 10px;
    width: 10px;
    border-radius: 50%;
    transition: background-color 0.4s;
    background-color: var(--primary-color);
  }
`;
const GovRadioButton = (props: radioProps) => {
  return (
    <GovRadioStyle
      className={props.selected ? "active" : ""}
      onClick={() => {
        props.onChange(props.name);
      }}
    >
      {
        <div className="unchecked">
          <div className={props.selected ? "checked" : ""}></div>
        </div>
      }
      <p
        style={{
          marginTop: ".4rem",
        }}
      >
        {props.name}
      </p>
    </GovRadioStyle>
  );
};

export default CheckBox;
