import React from 'react';
import {
  Switch,
  Route,
  RouteComponentProps,
  withRouter
} from 'react-router-dom';

import './App.css';
import { Question } from './components/Question';
import { NewUser } from './components/NewUser';
import { Statistics } from './components/Statistics';
import { WaitingPage } from './components/WaitingPage';
import { Winner } from './components/Winner';

export class App extends React.Component<RouteComponentProps<any>> {

  render(){
    return (
      <div className="App">
        <header className="App-header">
            <Switch>
              <Route path="/questions">
                <Question />
              </Route>
              <Route path="/stats">
                <Statistics />
              </Route>
              <Route path="/wait">
                <WaitingPage waitTime={60}/>
              </Route>
              <Route path="/winner">
                <Winner />
              </Route>
              <Route path="/">
                <NewUser />
              </Route>
            </Switch>   
        </header>
      </div>
    );
  }
}

export default withRouter(App);
