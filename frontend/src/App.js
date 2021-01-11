import './App.css';
import { connect } from 'react-redux';
import LoginScreen from './modules/loginScreen.js';
import Navigation from './modules/navigationBar.js';
import DirectChat from './modules/directChat.js'
import GamesList from './modules/gamesList.js';
import Game from './modules/game.js';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App({user}) {
  if (user.isLogged === false) {
    return(
      <div className="App">
        <LoginScreen />
      </div>
    );

  } else {
    return (
      <div className="App">
        <Router>
          <Navigation />
          <Switch>
            <Route path='/' exact component={GamesList} />
            <Route path='/Game' component={Game} />
            <Route path='/DirectChat' component={DirectChat} />
          </Switch>
        </Router>
      </div>
    );

  };

};

const mapStateToProps  = (state) => (
  {
    user:state.user
  }
);

export default connect(mapStateToProps, {})(App);
