import React from 'react';

import {ListItem} from './ListItem.jsx';

export class List extends React.Component {
    
    /**
    *
    *   this.props = {
    *     data: the list of items to render
    *     makeURL: a function with the logic to generate the row link
    *     hidden: list of column keys to hide, ex: ['id','url']
    *   }
    */
    constructor(){
      super();
      
    }
    
    
    render(){
      return this.renderLikeTable(this.props.items);
    }
    
    getTableColumns(){
      
      if(typeof this.props.columns == 'Array') return this.props.columns;
      var single = this.props.items[0];
      return Object.getOwnPropertyNames(single).map((title) => {
            return title.charAt(0).toUpperCase() + title.slice(1);
      });
    }
    
    renderLikeTable(){
        const tableColumns = this.getTableColumns();
      
        var rowsRender = this.props.items.map((item) => {
          return <ListItem key={item.id} data={item} type={'table'} hidden={this.props.hidden} 
                  onClick={this.props.onItemClick} 
                  columns={this.props.columns} 
                  />
        });
        
        var columnsRender = tableColumns.filter((col) => {
          return (typeof(this.props.hidden) != 'undefined' && this.props.hidden.indexOf(col.toLowerCase()) == -1)
        }).map((col) => {
          return <th key={col} scope="col">{col}</th>
        });
        
        if(typeof this.props.makeURL == 'function') columnsRender.push(<th key='url' scope="col"></th>);
        
        return(
          <div>
            <div style={{display: "none"}} className="btn-group" role="group" aria-label="Basic example">
              <button type="button" className="btn btn-secondary">Left</button>
              <button type="button" className="btn btn-secondary">Middle</button>
            </div>
            <table className="table">
              <thead>
                <tr>
                  {columnsRender}
                </tr>
              </thead>
              <tbody>
                {rowsRender}
              </tbody>
            </table>
          </div>
        );
    }
    
};