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
    editing: false
  }

  toggleEditor = () => {
    this.setState(prevState => ({
      ...prevState,
      editing: !prevState.editing
    }))
  }

  render() {
    const { children, message, options, currentValue, id, param, onEdit } = this.props;
    // console.log(children);

    // Clone children and add onClick prop
    const childrenWithProps = React.Children.map(
      children, child => React.cloneElement(child, { onClick: this.toggleEditor }));

    // Config editor for data types
    let editor;
    if (options) {
      editor = [
        <Globe key={uuid()} onClose={this.toggleEditor}>
          <div className="editor">
            <p className="message">{message || "Edit:"}</p>
            <Select
              searchable={false}
              clearable={false}
              options={options}
              value={currentValue}
              onChange={option => {
                onEdit(id, param, option.value);
                this.toggleEditor();
              }} />
          </div>
        </Globe>,
        childrenWithProps
      ]
    } else {
      editor =
        <input
          type="text"
          value={currentValue}
          onKeyDown={e => e.keyCode === 13 ? // Enter
            () => { onEdit(id, param, e.target.value); this.toggleEditor() }
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