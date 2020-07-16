import React from 'react';
import { Button, Card, Radio, RadioGroup } from '@blueprintjs/core';
import { handleStringChange } from '@blueprintjs/docs-theme';
import moment from 'moment';

import { TimerClock } from './TimerClock';
import { TerminalStage } from './TerminalStage';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { submitAnswer, getQuestion } from '../clients/gameClient';

interface Choice {
    id: string
    text: string;
}

interface QuestionState {
    value: string;
    hasError: boolean;
    questionText: string;
    choices: Choice[];
    questionId: string;
    gameId: string;
    playerId: string;
}

type QuestionProps = RouteComponentProps<void>;

// query params questionId, gameId, playerId, 

class PreConnectedQuestion extends React.Component<QuestionProps, QuestionState> {
    constructor(props: QuestionProps) {
        super(props);
        this.state = {value: '', hasError: false, questionText: '', choices: [], questionId: '', gameId: '', playerId: ''};
    }

    async componentDidMount() {
        await this.handleLoadQuestion();
    }

    async handleLoadQuestion() {
        const params = new URLSearchParams(this.props.location.search)
        const playerId  = params.get('playerId');
        const gameId  = params.get('gameId');
        if(!playerId || !gameId) {
            this.props.history.push('/');
        }

        const question = await getQuestion({playerId: playerId!, gameId: gameId!});
       
        if(question) {
            if (question.questionId === this.state.questionId) {
                this.props.history.push(`/wait?gameId=${gameId}&playerId=${playerId}`);
            }
            this.setState({
                    ...this.state,
                    gameId: gameId!,
                    playerId: playerId!,
                    questionId: question.questionId,
                    questionText: question.questionText,
                    choices: Object.keys(question.choices).map(key => ({id: key, text: question.choices[key]}))
            });
        } else {
            this.props.history.push(`/wait?gameId=${gameId}&playerId=${playerId}`)
        }
    }

    handleRadioChange = handleStringChange(value => this.setState({ value, hasError: false }));

    async handleSubmission ({questionId, gameId, playerId, answerId}: {questionId: string, gameId: string, playerId: string, answerId: string}) {
        if (answerId === '') {
            this.setState({value: answerId, hasError: true});
        } else {
            const response = await submitAnswer({questionId, gameId, playerId, answerId});
            if (response.status === 'WRONG') {
                this.props.history.push(`/stats?questionId=${questionId}&gameId=${gameId}`);
            } else if (response.status === 'RIGHT') {
                this.props.history.push(`/wait?gameId=${gameId}&playerId=${playerId}`)
            }
        }
    }

    handleStatistics({questionId, gameId}: {questionId: string, gameId: string}) {
        this.props.history.push(`/stats?questionId=${questionId}&gameId=${gameId}`)
    }

    render() {
        const { questionText, choices, questionId, gameId, playerId }  = this.state;
        const options = choices.map((choice: Choice) => <Radio label={choice.text} value={choice.id} />);
        const exitElement = <TerminalStage text='Times Up!!' getStatistics={() => this.handleStatistics({questionId, gameId})}/>;
        return(
        <TimerClock endTime={moment().add(10, 'seconds')}
                    spinnerDenominator={10}
                    exitElement={exitElement}>
           <Card interactive={false} className='questionCard' elevation={4}>
                <div style={{display: 'flex', flexDirection: 'column', textAlign: 'left'}}>
                    <div style={{flex: 1}}>
                    <RadioGroup label={questionText}
                                onChange={this.handleRadioChange}
                                selectedValue={this.state.value}
                    >
                    {options}
                    </RadioGroup>
                    </div>
                    <div style={{flex: 0, textAlign: 'right'}}>
                        <Button type="submit"
                                intent="primary" 
                                text="Submit"
                                large={true}
                                onClick={() => this.handleSubmission({questionId, gameId, playerId, answerId: this.state.value})}
                        />
                    </div>
            </div>
            </Card>
        </TimerClock>)
    }
}

export const Question = withRouter(PreConnectedQuestion);
