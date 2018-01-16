import React from 'react';

export class Counter extends React.Component {
    
    constructor(props) {
        
        super(props);
        
        this.state = {
            counter: 0
        }
        
        this.addOne = this.addOne.bind(this);
        this.styles = {
            background: '#BDBDBD',
            padding: '10px',
            margin: '20px',
        }
    }
    
    addOne() {
        this.setState({
            counter: this.state.counter + 1
        })
    }
    
    render() {
        return (
            <div style={this.styles}>
                <button onClick={ this.addOne }> Increment </button>
                { this.state.counter }
            </div>
        )
    }
}