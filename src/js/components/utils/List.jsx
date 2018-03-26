import React, { Component } from 'react';
import PropTypes from 'prop-types';
import uuidv4 from 'uuid';

import { ListItem } from './ListItem.jsx';

export class List extends Component {
  /**
   *   #### type = "table"
   *   props
   *
   *     * data: the list of items to render
   *     * makeURL: a function with the logic to generate the row link
   *     * columns: list of column keys to show, ex: ['id','url']
   *     * hiddenColumns: list of column keys to hide, ex: ['id','url']
   *   ---
   *   #### type = "card"
   *   props
   *
   *       * data: the list of items to render
   *       * heading: main title for the card
   *       * subheading: aditional info for the card
   *       * showInSubheading: array of items to show in subheading within <span></span>
   *       * makeURL: a function with the logic to generate details link
   *    ---
   *   #### type = "componentlist"
   *   props
   *
   *       * data: the list of items to render as the component passed in props
   *       * component: this is how the data will be rendered
   *       * removeItem: a function that handles the item removal [should receive an id of the item]
   *       * Additional props are passed to child compoment
   *    ---
   *    **renderLikeCard**'s _formatedSubheading_ **needs** to be adjusted to show values with different formatting
   */

  /**
   * Retrieve column headings from 'columns' prop
   * @memberof List
   */
  getTableColumns = () => {
    if (Array.isArray(this.props.columns)) return this.props.columns;
    const single = this.props.items[0];
    return Object.getOwnPropertyNames(single).map(title => title.charAt(0).toUpperCase() + title.slice(1));
  };
  /**
   * Renders data prop as a table
   * @memberof List
   */
  renderLikeTable = () => {
    const tableColumns = this.getTableColumns();

    const rowsRender = this.items.map(item => (
      <ListItem
        key={item.id}
        data={item}
        type="table"
        hiddenColumns={this.props.hiddenColumns}
        onClick={this.props.onItemClick}
        columns={this.props.columns}
        makeURL={this.props.makeURL}
      />
    ));

    const columnsRender = tableColumns
      .filter(
        col =>
          typeof this.props.hiddenColumns !== 'undefined' && this.props.hiddenColumns.indexOf(col.toLowerCase()) === -1
      )
      .map(col => (
        <th key={col} scope="col">
          {col}
        </th>
      ));

    if (typeof this.props.makeURL === 'function') columnsRender.push(<th key="url" scope="col" />);

    return (
      <table className="table">
        <thead>
          <tr>{columnsRender}</tr>
        </thead>
        <tbody>{rowsRender}</tbody>
      </table>
    );
  };

  /**
   * Renders data prop as a card
   * @memberof List
   */
  renderLikeCard = () => {
    const cards = this.props.items.map(item => {
      let formatedSubheading;

      if (
        this.props.showInSubheading &&
        Array.isArray(this.props.showInSubheading) &&
        this.props.showInSubheading.length > 0
      ) {
        const options = this.props.showInSubheading;

        formatedSubheading = options.map(option => {
          if (!item[option]) {
            return '';
          }
          return (
            <span className={option} key={option}>
              {item[option]}
            </span>
          );
        });
      } else {
        formatedSubheading = '';
      }

      return (
        <ListItem
          key={item.id}
          data={item}
          type="card"
          AcceptRejectButtons={this.props.AcceptRejectButtons}
          heading={item.id}
          subheading={formatedSubheading}
          removeCard={this.props.removeItem ? () => this.props.removeItem(item.id) : null}
          makeURL={this.props.makeURL}
        />
      );
    });

    return <div className="cards">{cards}</div>;
  };

  render() {
    const { component, type, items, heading, ...props } = this.props;
    let results;
    const Component = component;
    if (type.toLowerCase() === 'table') {
      results = this.renderLikeTable(items);
    } else if (type.toLowerCase() === 'card') {
      results = this.renderLikeCard(items);
    } else if (type.toLowerCase() === 'componentlist') {
      if (Array.isArray(items)) {
        results = [];
        items.forEach(item => {
          results.push(
            <Component
              key={uuidv4()}
              heading={item.id}
              item={item}
              removeCard={props.removeItem ? () => props.removeItem(item.id) : null}
              {...props}
            />
          );
        });
      } else {
        results = [];
        for (const key in items) {
          results.push(<Component key={uuidv4()} heading={key} items={items[key]} {...props} />);
        }
      }
    } else {
      results = items.map(item => {
        if (typeof item === 'object') {
          const content = [];
          const innerArray = item[Object.keys(item)[0]];
          innerArray.forEach(data => {
            for (const key in data) {
              content.push(<p key={uuidv4()}>{`${key}: ${data[key]}`}</p>);
            }
          });
          return <li key={uuidv4()}>{content}</li>;
        }
        return <li key={uuidv4()}>{item}</li>;
      });
    }

    return (
      <div className={`results-list ${props.classes || ''}`}>
        <div style={{ display: 'none' }} className="btn-group" role="group" aria-label="Basic example">
          <button type="button" className="btn btn-secondary">
            Left
          </button>
          <button type="button" className="btn btn-secondary">
            Middle
          </button>
        </div>
        <div className="list-header">
          <h3>{heading || 'Results'}</h3>
          {Array.isArray(items) && props.sort ? (
            <div className="sort-area">
              <input className="sort-input" type="checkbox" name="sort" id="sort" />
              <label className="sort-label" htmlFor="sort">
                Sort by
              </label>
              <div>
                {props.sortOptions.map(option => (
                  <button
                    key={uuidv4()}
                    className="sort-options"
                    onClick={() => props.sort(option.split('-').join(''))}
                  >
                    {option
                      .split('-')
                      .join(' ')
                      .toLowerCase()}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
        {results}
      </div>
    );
  }
}

List.propTypes = {
  component: PropTypes.any,
  type: PropTypes.string,
  items: PropTypes.any,
  heading: PropTypes.string,
  subheading: PropTypes.string,
  columns: PropTypes.array,
  hiddenColumns: PropTypes.array,
  onItemClick: PropTypes.func,
  makeURL: PropTypes.func,
  showInSubheading: PropTypes.bool,
  AcceptRejectButtons: PropTypes.bool,
  removeItem: PropTypes.func,
};
