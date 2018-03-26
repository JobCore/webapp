import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid/v4';

export class ListView extends React.Component {
  render() {
    if (typeof this.props.items === 'undefined') throw new Error('No property items defined for the ListView');
    else if (Array.isArray(this.props.items) && this.props.items.length === 0) {
      if (this.props.renderEmpty) return this.props.renderEmpty();
      return <span>No items</span>;
    }

    const Component = this.props.component;
    const dataList = this.props.items.map(data => <Component key={uuid()} data={data} />);

    return <div>{dataList}</div>;
  }
}

ListView.propTypes = {
  items: PropTypes.object,
  renderEmpty: PropTypes.bool,
  component: PropTypes.node,
};
