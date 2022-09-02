import styled from "styled-components";

export const ToolTip = styled.div`
  position: relative;

  &::before,
  &::after {
    --scale: 0;
    --arrow-size: 10px;
    --tooltip-color: #101010;

    position: absolute;
    top: -0.25rem;
    left: 50%;
    transform: translateX(-50%) translateY(var(--translate-y, 0))
      scale(var(--scale));
    transition: 150ms transform;
    transform-origin: bottom center;
  }

  &::before {
    --translate-y: calc(-100% - var(--arrow-size));
    content: attr(data-tooltip);
    border: 1px solid var(--primary-color);
    background-color: #111;
    padding: 0.04rem 1rem;
    color: white;
    border-radius: 0rem;
    text-align: center;
    line-height: 22px;
    width: max-content;
    height: max-content;
    max-width: 100%;
    background: var(--tooltip-color);
  }

  &:hover::before,
  &:hover::after {
    --scale: 1;
  }

  &::after {
    --translate-y: calc(-1 * var(--arrow-size));

    content: "";
    border: var(--arrow-size) solid transparent;
    border-top-color: var(--primary-color);
    transform-origin: top center;
  }
`;
