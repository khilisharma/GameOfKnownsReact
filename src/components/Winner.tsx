import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Button } from '@blueprintjs/core';
import { Fireworks } from 'fireworks/lib/react'

const fxProps = {
    count: 3,
    interval: 200,
    colors: ['#cc3333', '#4CAF50', '#81C784'],
    calc: (props: any, i: any) => ({
      ...props,
      x: (i + 1) * (window.innerWidth / 3) - (i + 1) * 100,
      y: 200 + Math.random() * 100 - 50 + (i === 2 ? -80 : 0)
    })
  }

class PreConnectedWinner extends React.PureComponent<RouteComponentProps<void>> {
    handleExit() {
        this.props.history.push("/");
    }

    render() {
        return (<div style={{display: 'flex', flexFlow: 'column'}}> 
            <Fireworks {...fxProps}/>
            <div style={{flex: 1}}>All hail the King of Knowns!!!</div>
            <div style={{flex: 0}}>
                <Button icon='heart' intent='success' text='New Game' onClick={this.handleExit.bind(this)}/>
            </div>
        </div>)
    }
}

export const Winner = withRouter(PreConnectedWinner);