import React, { useState } from 'react';
import 'firebase/functions';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import { CopyToClipboard } from 'react-copy-to-clipboard';

import { selectGameCode } from 'redux/game/selectors';

const Container = styled.div`
  display: flex;
  align-self: center;
`;

const Text = styled.div`
  color: white;
  margin-right: 5px;
`;

const GameCode = () => {
  const gameCode = useSelector(selectGameCode);
  const [isCopied, setIsCopied] = useState(false);

  return (
    <Container>
      <Text>{`Game code: ${gameCode}`}</Text>
      <CopyToClipboard text={gameCode} onCopy={() => setIsCopied(true)}>
        <button>{isCopied ? '✅ Copied. ' : 'Copy to clipboard'}</button>
      </CopyToClipboard>
    </Container>
  );
};

export default GameCode;
