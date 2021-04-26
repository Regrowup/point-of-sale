import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from './Button';
import './SelectList.scss';

class SelectList extends Component {
  static propTypes = {
    values: PropTypes.arrayOf(PropTypes.object).isRequired,
    onChange: PropTypes.func.isRequired,
    initialValue: PropTypes.object,
  }

  static defaultProps = {
    initialValue: null,
  }

  state = {
    selectedOrderIndex: this.props.initialValue
      ? this.props.values.indexOf(this.props.initialValue)
      : 0,
  };

  handleClick = index => {
    this.setState({ selectedOrderIndex: index });
    this.props.onChange(this.props.values[index]);
  }

  render() {
    return (
      <div className="SelectList-container">
        {this.props.values.map((val, i) => (
          <Button
            onClick={() => this.handleClick(i)}
            key={i}
            className={`select-item ${i === this.state.selectedOrderIndex ? 'selected' : ''}`}
          >
            {val.name}
            {i === this.state.selectedOrderIndex
              ? <i className="material-icons" aria-hidden="true">check</i>
              : null
            }
          </Button>
        ))}
      </div>
    );
  }
}

export default SelectList;
