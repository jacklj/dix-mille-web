import styled from 'styled-components';

const Input = styled.input`
  border: 0;
  outline: 0;
  background: transparent;
  border-bottom: 2px solid rgb(180, 176, 85);
  color: #ffbf00;
  font-size: 1.2em;
  font-family: 'Playfair Display', serif;

  &::placeholder {
    font-size: 1.1em;
    color: rgba(180, 176, 85, 0.5);
  }

  &::selection {
    color: rgba(180, 176, 85, 0.5);
    background: #ffb7b7;
  }
`;

export default Input;
