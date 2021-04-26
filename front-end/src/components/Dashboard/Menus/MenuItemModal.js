import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Selectivity from 'selectivity/react';
import 'selectivity/styles/selectivity-react.min.css';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';
import { reduce, isEqual, isBoolean } from 'lodash';
import Textfield from '../../Textfield';

class MenuItemModal extends Component {
  static propTypes = {
    menuItem: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      price: PropTypes.number,
      to_kitchen(props, propName, componentName) {
        const prop = props[propName];
        if (prop !== 0 && prop !== 1 && !isBoolean(prop)) {
          return new Error(`
            Invalid prop \`${propName}\` with value ${prop} of type \`${typeof prop}\` supplied to ${componentName}.
            Expected 0, 1, or boolean. Validation failed.
          `);
        }
      },
    }),
    setOkData: PropTypes.func,
    menu: PropTypes.arrayOf(PropTypes.object).isRequired,
  };

  static defaultProps = {
    menuItem: null,
    setOkData: null,
  };

  constructor(props) {
    super(props);
    let {
      id, name = '', price, to_kitchen = false, category_id,
    } = props.menuItem || {};

    price = (price && (price / 100).toFixed(2)) || '';

    this.state = {
      id, name, price, to_kitchen, category_id,
      categoriesSelectList: [],
      selectedCategory: null,
    };

    this.savedItem = { id, name, price, to_kitchen, category_id };
  }

  componentDidMount() {
    this.setCategoriesSelectList(this.state.category_id);
  }

  componentDidUpdate(prevProps, prevState) {
    if (isEqual(prevState, this.state)) return;
    let modifiedVals = reduce(this.savedItem, (result, savedVal, key) => {
      let curVal = this.state[key];

      if (!isEqual(savedVal, curVal)) {
        result[key] = curVal;
      }

      return result;
    }, {});

    this.props.setOkData(modifiedVals);
  }

  setCategoriesSelectList(selectedId) {
    const categoriesSelectList = this.props.menu.map(topCategory => {
      const items = topCategory.categories.map(({ name, id }) => {
        const listId = `${id}-${name}`;

        if (id === selectedId) {
          this.setState({ selectedCategory: listId });
        }

        return { text: name, id: listId };
      });

      return {
        id: `${topCategory.id}-${topCategory.name}`,
        text: topCategory.name,
        submenu: { items },
      };
    });

    this.setState({ categoriesSelectList });
  }

  render() {
    return (
      <div className="menu-item-form">
        <Textfield
          value={this.state.name}
          required
          maxLength={100}
          onChange={({ currentTarget }) => this.setState({ name: currentTarget.value })}
          label="Name"
        />

        <div className="money-input">
          <div className="icon">$</div>
          <Textfield
            value={this.state.price}
            maxLength={8}
            required
            label="Price"
            onBlur={({ currentTarget }) => this.setState({ price: parseFloat(currentTarget.value).toFixed(2) })}
            onChange={({ currentTarget }) => this.setState({ price: currentTarget.value.replace(/[^0-9.]/g, '') })}
          />
        </div>

        {this.state.id && (
          <div className="category-select">
            <label className="blue-label">Category</label>
            <Selectivity.React
              value={this.state.selectedCategory}
              items={this.state.categoriesSelectList}
              showSearchInputInDropdown={false}
              onChange={event => this.setState({ category_id: parseInt(event.value, 10) })}
            />
          </div>
        )}

        <label className="toggle-group">
          Send to Kitchen
          <Toggle
            icons={false}
            defaultChecked={!!this.state.to_kitchen}
            onChange={e => this.setState({ to_kitchen: e.currentTarget.checked })}
          />
        </label>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  menu: state.menu,
});

export default connect(mapStateToProps)(MenuItemModal);
