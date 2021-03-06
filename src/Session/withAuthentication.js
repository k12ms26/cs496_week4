import React from 'react';
import firebase from 'firebase';
import AuthUserContext from './context';
import { withFirebase } from '../Firebase';

const withAuthentication = Component => {
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        authUser: null,
      };
    }

    componentDidMount = () => {
      firebase.auth().onAuthStateChanged(user=> {
        this.setState({ authUser: user});
      });
    };

    // componentWillUnmount() {
    //   this.authListener();
    // }

    render() {
      return (
        <AuthUserContext.Provider value={this.state.authUser}>
          <Component {...this.props} />
        </AuthUserContext.Provider>
      );
    }
  }

  return withFirebase(WithAuthentication);
};

export default withAuthentication;