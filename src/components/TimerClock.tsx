import React from 'react';
import moment from 'moment';
import { Spinner } from '@blueprintjs/core'

interface TimerClockState {
    date: number
}

interface TimerClockProps {
    endTime: moment.Moment;
    spinnerDenominator: number;
    exitElement: string | JSX.Element
    loadQuestion?: () => void;
}

export class TimerClock extends React.Component<TimerClockProps, TimerClockState> {
    timerID: any = setInterval(
        () => this.tick(),
        1000
      );

    constructor(props: TimerClockProps) {
        super(props);
        this.state = {date: moment.now()};
      }

    componentDidMount() {
        this.timerID = setInterval(
          () => this.tick(),
          1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    async tick() {
        this.setState({
          date: moment.now()
        });
        if (this.props.loadQuestion) {
            await this.props.loadQuestion();
        }
    }

    render() {
        const remaining =this.props.endTime.diff(moment(), 's');
        if (remaining < 0) {
            return this.props.exitElement;
        }
        return (
            <div style={{display: 'flex'}}>  
                <div style={{flex: '1 100%'}}>{this.props.children}</div>
                <div style={{flex: 0}}>
                <Spinner intent="primary" size={Spinner.SIZE_LARGE} value={remaining / this.props.spinnerDenominator} />
                </div>
            </div>
        );
      }
}