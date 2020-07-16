import React from 'react';
import moment from 'moment';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Button, NonIdealState } from '@blueprintjs/core';

import { TimerClock } from './TimerClock';
import { describeToken, getQuestion } from '../clients/gameClient';


interface WaitingPageStateProps {
    waitTime: number;
}

type WaitingPageProps = WaitingPageStateProps & RouteComponentProps<void>;
class PreConnectedWaitingPage extends React.PureComponent<WaitingPageProps> {
    _isMounted = false;

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    async handleLoadQuestion() {
        const params = new URLSearchParams(this.props.location.search)
        const tokenId = params.get('playerToken');
        const playerId = params.get('playerId');
        const gameId = params.get('gameId');
        if (this._isMounted) {
            if (tokenId) {
                const response = await describeToken(tokenId);
                if (response.status === 'JOINED') {
                    const question = await getQuestion({gameId: response.gameId!, playerId: response.playerId!});
                    if (question) {
                        this.props.history.push(`/questions?gameId=${response.gameId}&playerId=${response.playerId}`);
                    }
                }
            } else if (playerId && gameId) {
                this.props.history.push(`/questions?gameId=${gameId}&playerId=${playerId}`);
            } else {
                this.props.history.push('/')
            }
        }
    }

    handleExit() {
        this.props.history.push('/');
    }

    render() {
        return(
            <>
                <div>Waiting for other players to join</div>
                <TimerClock exitElement={<NonIdealState icon='issue'
                                                        children={<Button icon='heart-broken'
                                                                          intent='danger'
                                                                          text='Exit'
                                                                          large={true}
                                                                          onClick={this.handleExit.bind(this)}/>}
                                                        description="Something went wrong!!" />}
                            spinnerDenominator={this.props.waitTime}
                            loadQuestion={this.handleLoadQuestion.bind(this)}
                            endTime={moment().add(this.props.waitTime, 'seconds')}/>
            </>
        );
    }
}

export const WaitingPage = withRouter(PreConnectedWaitingPage);