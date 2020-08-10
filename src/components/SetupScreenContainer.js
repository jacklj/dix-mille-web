import styled from 'styled-components';

const SetupScreenContainer = styled.div`
  overflow: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;

  padding-top: 30px;
  padding-bottom: 40px;

  // so content doesn't go under the notch on notched phones
  padding-left: max(env(safe-area-inset-left), 15px);
  padding-right: max(env(safe-area-inset-right), 15px);
  // N.B. max() isn't supported by Firefox for Android https://caniuse.com/#search=max%20function
`;

export default SetupScreenContainer;
