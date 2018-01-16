import React from 'react';


export class Selector extends React.Component {
    
    constructor(){
      super();
      
    }
    
    render(){
        
        if(this.props.hide == true) return null;
        
        const stuffLikeHTML = this.props.stuff.map(function(item){
            return <option key={item.value} value={item.value}>{item.name}</option>
        });
        
        return (
              <select onChange={ (evt)=> {
                    this.props.onChange(evt.target.value); }
              }>
                {stuffLikeHTML}
              </select>
              )
    }
    
    
};