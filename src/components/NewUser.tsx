import React from 'react'
import { Button, FormGroup, Icon, InputGroup } from '@blueprintjs/core';
import { handleStringChange } from '@blueprintjs/docs-theme';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { joinGame } from '../clients/gameClient';


interface NewUserState {
    name: string,
    hasError: boolean;
}

type NewUserProps = RouteComponentProps<void>;

class PreConnectedNewUser extends React.Component<NewUserProps, NewUserState> {
    constructor(props: NewUserProps) {
        super(props);
        this.state = {
            name: '',
            hasError: false
        }
    }

    handleOnChange = handleStringChange(name => this.setState({ name, hasError: false }));

    async handleSubmission() {
        const {name} = this.state;
        if (name === '') {
            this.setState({name, hasError: true});
        } else {
            const response = await joinGame(name);
            this.props.history.push(`/wait?playerToken=${response.tokenId}`);
        }
    }

    render() {
        const error = this.state.hasError ? 
        <div style={{flex: 0, fontSize: '16px', color: '#c23030'}}>
            <Icon icon='issue'
              iconSize={16}
              intent='danger'/> Name cannot be empty
        </div> : null;
        return (
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div style={{flex: '1', top: 10, maxWidth: '50%'}}>
                    <FormGroup
                    helperText={error}
                    label="Ready to fight for the Throne???"
                    labelFor="text-input">
                        <InputGroup onChange={this.handleOnChange.bind(this)}
                                    round={true}
                                    placeholder='John Snow'
                                    value={this.state.name}
                                    large={true}/>
                        <Button intent='primary' 
                                type='submit' 
                                text='Join game'
                                large={true}
                                onClick={this.handleSubmission.bind(this)}/>                 
                    </FormGroup>
                </div>
            </div>
        );
    }
}


export const NewUser = withRouter(PreConnectedNewUser);