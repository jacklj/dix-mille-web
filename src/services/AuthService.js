import * as firebase from 'firebase/app';
import 'firebase/auth';

class AuthService {
  subscribeToAuthStateChangeListener() {
    if (this.unsubscribeFromAuthStateChangeListener) {
      console.log(
        'Auth state change listener was already subscribed - unsbscribe first',
      );
      this.unsubscribeFromAuthStateChangeListener();
    }

    this.unsubscribeFromAuthStateChangeListener = firebase
      .auth()
      .onAuthStateChanged((user) => {
        if (user) {
          // User is signed in.
          console.log('User signed in', user);
          // var isAnonymous = user.isAnonymous;
          // var uid = user.uid;
          // ...
        } else {
          // User is signed out.
          console.log('User signed out', user);
        }
      });
  }
}

export default new AuthService();
