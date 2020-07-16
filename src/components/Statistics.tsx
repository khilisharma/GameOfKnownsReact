import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Button } from '@blueprintjs/core';
import {Bar} from 'react-chartjs-2';
import { getStatistics } from '../clients/gameClient';

interface Stat {
    [key: string]: number;
}
// queryParams = gameId & questionid

const buildGraphData = (stats: Stat) => {
    return {
            labels: ['Choice 1', 'Choice 2', 'Choice 3'],
            datasets: [
                {
                    label: 'People',
                    backgroundColor: 'rgba(75,192,192,1)',
                    borderColor: 'rgba(0,0,0,1)',
                    borderWidth: 2,
                    data: [stats['0'], stats['1'], stats['2']]
            }]
        }
}

interface StatisticsState {
    frequencies: Stat
}

class PreConnectedStatistics extends React.Component<RouteComponentProps<void>, StatisticsState> {
    constructor(props: RouteComponentProps<void>) {
        super(props);
        this.state = {
            frequencies: {
                1: 0, 2: 0, 3: 0
            }
        };
    }

    async componentDidMount() {
        await this.handleLoadStats();
    }

    async handleLoadStats() {
        const params = new URLSearchParams(this.props.location.search)
        const questionId  = params.get('questionId');
        const gameId  = params.get('gameId');
        if(!questionId || !gameId) {
            this.props.history.push('/');
        }
        const stats = await getStatistics({questionId: questionId!, gameId: gameId!})
        this.setState({frequencies: stats})
    }

    handleExit() {
        this.props.history.push("/");
    }

    render() {
        return (
            <div>
                <Bar data={buildGraphData(this.state.frequencies)}
                     options={{
                     title:{
                        display:true,
                        text:'What others answered?',
                        fontSize:20
                    },
                    legend:{
                    display:true,
                    position:'right'}
                }}        
                />
                <Button icon='heart' intent='success' text='New Game' onClick={this.handleExit.bind(this)}/>
            </div>);
    }
}

export const Statistics = withRouter(PreConnectedStatistics);
