import React, { Component } from "react";

import { ListItem } from "./ListItem.jsx";
import ReactStars from "react-stars";
import EmployerStore from "../../store/EmployerStore";

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
  *    **renderLikeCard**'s _formatedSubheading_ **needs** to be adjusted to show values with different formatting
  */

  render() {
    let results;
    if (this.props.type.toLowerCase() === "table") {
      results = this.renderLikeTable(this.props.items);
    } else if (this.props.type.toLowerCase() === "card") {
      results = this.renderLikeCard(this.props.items);
    } else {
      results = this.props.items;
    }

    return (
      <div className={`results-list ${this.props.classes || ""}`}>
        <div style={{ display: "none", }} className="btn-group" role="group" aria-label="Basic example">
          <button type="button" className="btn btn-secondary">Left</button>
          <button type="button" className="btn btn-secondary">Middle</button>
        </div>
        <div className="list-header">
          <h3>Results</h3>
          {
            this.props.items[0].rating ?
              <div className="sort-area">
                <input className="sort-input" type="checkbox" name="sort" id="sort" />
                <label className="sort-label" htmlFor="sort">Sort by Rating</label>
                <div>
                  <button onClick={() => this.props.sort("asc")}>Ascending</button>
                  <button onClick={() => this.props.sort("desc")}>Descending</button>
                </div>
              </div> :
              null}
        </div>
        {results}
      </div>
    )
  }


  /**
   * Retrieve column headings from 'columns' prop
   * @memberof List
   */
  getTableColumns = () => {
    if (Array.isArray(this.props.columns)) return this.props.columns;
    var single = this.props.items[0];
    return Object.getOwnPropertyNames(single).map((title) => {
      return title.charAt(0).toUpperCase() + title.slice(1);
    });
  }
  /**
   * Renders data prop as a table
   * @memberof List
   */
  renderLikeTable = () => {
    const tableColumns = this.getTableColumns();

    var rowsRender = this.props.items.map((item) => {
      return <ListItem
        key={item.id}
        data={item}
        type={"table"}
        hiddenColumns={this.props.hiddenColumns}
        onClick={this.props.onItemClick}
        columns={this.props.columns}
        makeURL={this.props.makeURL}
      />;
    });

    var columnsRender = tableColumns.filter((col) => {
      return (typeof (this.props.hiddenColumns) !== "undefined" && this.props.hiddenColumns.indexOf(col.toLowerCase()) === -1);
    }).map((col) => {
      return <th key={col} scope="col">{col}</th>;
    });

    if (typeof this.props.makeURL === "function") columnsRender.push(<th key='url' scope="col"></th>);

    return (
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
    );
  }

  /**
   * Renders data prop as a card
   * @memberof List
   */
  renderLikeCard = () => {
    var cards = this.props.items.map((item) => {
      let formatedSubheading;

      if (this.props.showInSubheading && Array.isArray(this.props.showInSubheading) && this.props.showInSubheading.length > 0) {
        const options = this.props.showInSubheading;

        formatedSubheading = options.map(
          option => {
            switch (option) {
              case "favorite":
                if (!EmployerStore.isEmployeeInFavoriteList(item.id)) { return "" }
                return <span className={option} key={option}>{item[option]}</span>;
              case "rating":
                if (!item[option]) { return "" }
                return (
                  <span className={option} key={option}>
                    <ReactStars size={16} value={item[option]} edit={false} />
                  </span>
                );
              case "badges":
                if (!item[option]) { return "" }
                let badges = item[option].map(badge => <span key={badge} className="badge">{badge}</span>)
                return (
                  <span className={option} key={option}>
                    {badges}
                  </span>
                )
              case "responseTime":
                if (!item[option]) { return "" }
                let classes = [option];
                classes.push(item[option] > 719 ? "warning" : "fast");
                classes = classes.join(" ");
                let time = item[option] > 59 ? Math.ceil(item[option] / 60) + " hour(s)" : item[option] + " minute(s)";
                return <span className={classes} key={option}>Anwers in: {time}</span>;
              default:
                if (!item[option]) { return "" }
                return <span className={option} key={option}>{item[option]}</span>;
            }
          }
        );

      } else { formatedSubheading = ""; }

      return <ListItem
        key={item.id}
        data={item}
        type={"card"}
        heading={`${item.name} ${item.lastname}`}
        subheading={formatedSubheading}
        removeCard={this.props.removeItem ? () => this.props.removeItem(item.id) : null}
        makeURL={this.props.makeURL}
      />;
    });

    return (
      <div className="cards">
        {cards}
      </div>
    );
  }

}