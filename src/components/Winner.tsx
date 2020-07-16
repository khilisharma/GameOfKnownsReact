import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Button } from '@blueprintjs/core';

class PreConnectedWinner extends React.PureComponent<RouteComponentProps<void>> {
    handleExit() {
        this.props.history.push("/");
    }

    render() {
        return (<div style={{display: 'flex', flexFlow: 'column'}}> 
            <div style={{flex: 1}}>All hail the King of Knowns!!!</div>
            <div style={{flex: 0}}>
                <Button icon='heart' intent='success' text='New Game' onClick={this.handleExit.bind(this)}/>
            </div>
        </div>)
    }
}

export const Winner = withRouter(PreConnectedWinner);