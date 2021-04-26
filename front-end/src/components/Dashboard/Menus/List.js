import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FlipMove from 'react-flip-move';
import { isArray } from 'lodash';
import Button from '../../Button';

class List extends Component {
  static propTypes = {
    listItems: PropTypes.arrayOf(PropTypes.element),
    categoryId: PropTypes.number,
    title: PropTypes.string.isRequired,
    emptyText: PropTypes.string.isRequired,
    noneSelectedText: PropTypes.string.isRequired,
    disableAdd: PropTypes.bool.isRequired,
    addAction: PropTypes.func.isRequired,
  };

  static defaultProps = {
    listItems: null,
    categoryId: null,
  };

  constructor(props) {
    super(props);
    this.state = { disableAnimations: true };
  }

  componentWillReceiveProps(nextProps) {
    /* Only enable animation when adding or removing items, not when switching lists */
    if (
      isArray(this.props.listItems) && isArray(nextProps.listItems) &&
      this.props.categoryId === nextProps.categoryId
    ) {
      this.setState({ disableAnimations: false });
    } else {
      this.setState({ disableAnimations: true });
    }
  }

  render() {
    const { listItems, emptyText, noneSelectedText } = this.props;
    let listContent;
    if (listItems) {
      listContent = listItems.length > 0
        ? listItems
        : <div>{emptyText}</div>;
    } else {
      listContent = <div>{noneSelectedText}</div>;
    }

    return (
      <section className="column">
        <header>
          <h2>{this.props.title}</h2>
          <Button
            round
            raised
            color="green"
            icon="add"
            disabled={this.props.disableAdd}
            onClick={this.props.addAction}
          />
        </header>
        <FlipMove
          disableAllAnimations={this.state.disableAnimations}
          enterAnimation="fade"
          leaveAnimation="fade"
          className={listItems && listItems.length > 0 ? 'list' : 'none-selected'}
        >
          {listContent}
        </FlipMove>
      </section>
    );
  }
}

export default List;
