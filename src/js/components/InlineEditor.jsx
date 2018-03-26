import React from 'react';
import PropTypes from 'prop-types';

class InlineEditor extends React.Component {
  /*
    Dependencies
    -------------
    * react-select
    * uuid
    * globe (to be displayed as tooltip-like dialogue box)


    Props (API)
    -------------
    children: Element to render by default. [Multiple children are not supported]

    message: Message to display on the dialogue box

    options: An array with labels and values used to create the Select tag.

    currentValue: Value to be displayed by default on Input or Select
                  If a Select field will be rendered, currentValue should have the following formating: {label: "...", value: "..."}

    onEdit: Update function to be excuted on edit. Needs an {id}, a {param} and a {value} as @params

    id: Id of the element to be edited

    param: Param to be edited
  */

  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      value: props.currentValue,
    };
  }

  toggleEditor = () => {
    this.setState(prevState => ({
      value: this.props.currentValue,
      editing: !prevState.editing,
    }));
  };

  handleChange = e => {
    this.setState({ value: e.target.value });
  };

  editParam = () => {
    const { id, param, onEdit } = this.props;
    onEdit(id, { [param]: this.state.value });
    this.toggleEditor();
  };

  render() {
    const { children } = this.props;

    // Clone children and add onClick prop
    const childrenWithProps = React.Children.map(children, child =>
      React.cloneElement(child, { onClick: this.toggleEditor })
    );
    // Config editor for data types
    const editor = (
      <span className="inline-editor-area">
        <input
          required
          type={this.props.type || 'text'}
          className="form-control"
          value={this.state.value}
          onChange={this.handleChange}
        />
        <button className="btn btn-primary" onClick={this.editParam}>
          Save
        </button>
        <button className="btn btn-danger" onClick={this.toggleEditor}>
          Cancel
        </button>
      </span>
    );

    return this.state.editing ? editor : childrenWithProps;
  }
}

InlineEditor.propTypes = {
  type: PropTypes.string,
  children: PropTypes.any,
  currentValue: PropTypes.string,
  id: PropTypes.number,
  param: PropTypes.string,
  onEdit: PropTypes.func,
};

export default InlineEditor;
