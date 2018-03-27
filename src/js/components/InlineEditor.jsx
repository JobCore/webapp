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
      isValid: true,
    };
  }

  toggleEditor = () => {
    this.setState(prevState => ({
      value: this.props.currentValue,
      editing: !prevState.editing,
    }));
  };

  handleChange = e => {
    const validInput = this.props.maxLength ? e.target.value.length <= parseInt(this.props.maxLength) : true;
    this.setState({ value: e.target.value, isValid: validInput });
  };

  editParam = () => {
    const { id, param, onEdit } = this.props;
    onEdit(id, { [param]: this.state.value });
    this.toggleEditor();
  };

  render() {
    const { children, type, ...props } = this.props;
    delete props.id;
    delete props.currentValue;
    delete props.param;
    delete props.onEdit;

    // Clone children and add onClick prop
    const childrenWithProps = React.Children.map(children, child =>
      React.cloneElement(child, { onClick: this.toggleEditor })
    );
    // Config editor for data types
    const editor = (
      <span className="inline-editor-area">
        {type === 'textarea' ? (
          <textarea className="form-control" value={this.state.value} onChange={this.handleChange} {...props} />
        ) : (
          <input
            required
            type={type || 'text'}
            className="form-control"
            value={this.state.value}
            onChange={this.handleChange}
            {...props}
          />
        )}
        <button className="btn btn-primary" onClick={this.editParam} disabled={!this.state.isValid}>
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
  maxLength: PropTypes.string,
};

export default InlineEditor;
