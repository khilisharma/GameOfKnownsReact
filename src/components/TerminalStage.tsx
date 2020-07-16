import React from 'react'
import { Button } from '@blueprintjs/core';
import { withRouter, RouteComponentProps } from 'react-router-dom';

interface TerminalStageStateProps {
    text: string;
    getStatistics: () => void;
}

export class PreConnectedTerminalStage extends React.PureComponent<TerminalStageStateProps & RouteComponentProps<void>> {
    handleExit() {
        this.props.history.push("/");
    }

    render() {
        return ( 
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <div style={{flex: 1}}>{this.props.text}</div>
            <div style={{flex: 0}}>
                <Button icon='heart-broken' intent='danger' text='Exit' large={true} onClick={this.handleExit.bind(this)}/>
                <Button icon='chart' intent='primary' text='Stats' large={true} onClick={() => {this.props.getStatistics()}}/>
            </div>
        </div>);
    }
}

export const TerminalStage = withRouter(PreConnectedTerminalStage);