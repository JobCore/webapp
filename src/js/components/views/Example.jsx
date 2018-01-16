import React from 'react';

import {Counter} from './examples/Counter.jsx';
import {Time} from './examples/Time.jsx';

export class Example extends React.Component {
    
    constructor(props) {
        
        super(props);
        
        this.state = {
            display: 'counter'
        }
        this.pickExample = this.pickExample.bind(this);
    }
    
    pickExample(evt){
        
        console.log(this.state);
        this.setState({
           display: evt.target.value 
        });
    }
    
    render() {
        var template = <div className="container">
                <select onChange={this.pickExample}>
                    <option value='none'>Choose and example</option>
                    <option value='counter'>Counter</option>
                    <option value='time'>Time</option>
                </select>
            </div>;
            
        return (
            <div className='example'>
                {template}
                {(this.state.display == 'counter') ? (<Counter />) : ''}
                {(this.state.display == 'time') ? (<Time />) : ''}
            </div>
        );
    }
}