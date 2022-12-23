import React, { Component } from 'react';
import './App.css';

import Campaign from './Campaign';
 
class App extends Component {

state = { loading: true, drizzleState: null };


async componentDidMount() {
    const { drizzle } = this.props;

    this.unsubscribe = drizzle.store.subscribe(() => {

      const drizzleState = drizzle.store.getState();
      if (drizzleState.drizzleStatus.initialized) {
        this.setState({ loading: false, drizzleState });
      }
    });
  }


compomentWillUnmount() {
    this.unsubscribe();
  }

  render() {
  if (this.state.loading) return "Loading Drizzle...";
    return (


    <div className="App">

      <h2 >Crowd Funding Application</h2>

      <Campaign
        drizzle={this.props.drizzle}
        drizzleState={this.state.drizzleState}
      />
      </div>
    );
  }
}

export default App;

