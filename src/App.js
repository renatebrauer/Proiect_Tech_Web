import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import './App.css';
import SignIn from './components/SignIn/SignIn';
import Navbar from './helpers/Navbar';

function App() {  
    return (
      <div>
          <Router>
            <Switch>
              <Route path="/dash" component={Navbar} />
              <Route path="/" component={SignIn} />
            </Switch>
          </Router>
      </div>
    );    
}

export default App;