const firebase = jest.genMockFromModule('firebase');

const onAuthStateChanged = jest.fn((x) => x());

const auth = jest.fn(() => ({
  onAuthStateChanged,
}));

firebase.functions = jest.fn(() => ({
  auth,
}));

module.exports = firebase;
