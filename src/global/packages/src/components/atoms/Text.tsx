import styled from 'styled-components';

interface Props {
  type: 'title' | 'subtitle' | 'text' | 'subtext';
  color?: 'white' | 'primary';
  align?: 'left' | 'center' | 'right';
}

const Mapper = {
  white: 'white',
  primary: 'var(--primary-color)',
  title: '32px',
  subtitle: '30px',
  text: '18px',
  subtext: '18px',
};

export const Text = styled.p<Props>`
  color: ${({ color }) => Mapper[color ?? 'primary']};
  font-size: ${({ type }) => Mapper[type]};
  text-align: ${({ align }) => align ?? 'center'};
`;
