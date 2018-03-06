import React, { Component } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid/v4';
import Select from 'react-select';
import Globe from './utils/Globe';
class InlineTooltipEditor extends Component {

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

    param: Param to eb edited
  */

  state = {
    editing: false,
    value: this.props.currentValue,
  }

  toggleEditor = () => {
    if (!this.props.isEditorOpen) {
      this.setState({
        value: this.props.currentValue,
        editing: true
      }, this.props.toggleInlineEditor())
    } else {
      this.setState(prevState => {
        if (prevState.editing) this.props.toggleInlineEditor();
        return ({
          ...prevState,
          value: this.props.currentValue,
          editing: false
        });
      })
    }
  }

  handleChange = value => {
    this.setState({ value });
  }

  editParam = value => {
    const { id, param, onEdit } = this.props;
    if (id) {
      onEdit(id, param, value);
    } else {
      onEdit(param, value);
    }
    this.toggleEditor();
  }

  render() {
    const { children, message, options, currentValue } = this.props;

    // Clone children and add onClick prop
    const childrenWithProps = React.Children.map(
      children, child => React.cloneElement(child, { onClick: this.toggleEditor }));
    // Config editor for data types
    let editor;
    if (this.props.type || options) {
      editor = [
        <Globe
          key={uuid()}
          onClose={() => { this.toggleEditor(); }}
          classes={this.props.classes}>
          <div className="editor">
            <p className="message">{message || "Edit:"}</p>
            {
              options &&
              <Select
                required
                multi={this.props.multi || false}
                searchable={false}
                clearable={false}
                options={options}
                value={this.state.value}
                onChange={option => this.handleChange(option.hasOwnProperty("value") && option.value !== null ? option.value : option)} />
            }
            {
              this.props.type &&
              <input
                required
                className="form-control"
                type={this.props.type.toLowerCase()}
                min={this.props.min || 0}
                max={this.props.max || 99}
                defaultValue={this.state.value}
                onChange={event => this.handleChange(event.target.value)} />
            }
            <div className="buttons">
              <button
                className="btn btn-primary save"
                onClick={() => this.editParam(this.state.value)}>Save</button>
              <button
                className="cancel btn btn-danger"
                onClick={() => { this.toggleEditor(); }}>Cancel</button>
            </div>
          </div>
        </Globe>,
        childrenWithProps
      ]
    } else {
      editor =
        <input
          required
          type="text"
          value={currentValue}
          onKeyDown={e => e.keyCode === 13 ? // Enter
            () => this.editParam()
            : null} />
    }

    return this.state.editing ?
      <span className="editor-area">{editor}</span>
      : childrenWithProps;
  }
}

InlineTooltipEditor.propTypes = {
  message: PropTypes.string,
  options: PropTypes.array,
  children: PropTypes.node,
  id: PropTypes.string,
  param: PropTypes.string,
  onEdit: PropTypes.func
}

export default InlineTooltipEditor;