import AuthService from './AuthService';

describe('subscribeToAuthStateChangeListener', () => {
  it('calls onAuthStateChange listener', () => {
    // const spy = jest.spyOn('firebase/app', 'auth().onAuthStateChained');
    const listenerCallback = jest.fn();

    AuthService.subscribeToAuthStateChangeListener(listenerCallback);
    expect(listenerCallback).toHaveBeenCalled();
  });
});
