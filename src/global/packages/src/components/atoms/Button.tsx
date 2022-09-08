import styled from 'styled-components';

const Sizes = {
  'x-sm': 16,
  sm: 18,
  md: 20,
  lg: 22,
  'x-lg': 28,
};
interface Props {
  size?: 'x-sm' | 'sm' | 'md' | 'lg' | 'x-lg';
  padding?: 'x-sm' | 'sm' | 'md' | 'lg' | 'x-lg';
}
const PrimaryButton = styled.button<Props>`
  font-weight: 300;
  font-size: ${({ size }) => Sizes[size ?? 'md'] + 'px'};
  background-color: var(--primary-color);
  color: var(--pitch-black-color);
  padding: 0.4rem 2rem;
  border: 1px solid transparent;
  display: flex;
  align-self: center;
  justify-content: center;
  text-align: center;

  &:hover {
    background-color: var(--primary-dark-color);
    cursor: pointer;
  }

  &:disabled {
    background-color: var(--dark-grey-color);
    color: var(--holy-grey-color);
  }
`;

const OutlinedButton = styled(PrimaryButton)<Props>`
  background-color: var(--pitch-black-color);
  color: var(--primary-color);
  border: 1px solid var(--primary-color);

  &:hover {
    background-color: #172b23;
    cursor: pointer;
  }

  &:disabled {
    color: var(--holy-grey-color);
    background-color: var(--pitch-black-color);
    border: 1px solid var(--holy-grey-color);
  }
`;

const FilledButton = styled(PrimaryButton)<Props>`
  background-color: var(--too-dark-color);
  color: var(--off-white-color);
  &:hover {
    background-color: var(--dark-grey-color);
    color: var(--off-white-color);
    border: 1px solid var(--dark-grey-color);
  }
  &:disabled {
    background-color: var(--dark-grey-color);
    color: var(--holy-grey-color);
  }
`;
const HighlightButton = styled(FilledButton)<Props>`
  background-color: #172b23;
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  padding: 1rem !important;

  &:hover {
    background-color: #203128;
    color: var(--primary-dark-color);
    border: 1px solid var(--primary-darker-color);
  }

  &:disabled {
    background-color: #373737;
    color: var(--off-white-color);
    border: 1px solid var(--off-white-color);
  }
`;
export { PrimaryButton, OutlinedButton, FilledButton, HighlightButton };
