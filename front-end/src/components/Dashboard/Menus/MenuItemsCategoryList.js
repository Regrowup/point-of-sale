import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import styled from 'styled-components';
import Button from '../../Button';

const ActionButtons = styled.div`
  position: absolute;
  display: flex;
  padding-right: 1rem;
`;

class MenuItemsCategoryList extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    categories: PropTypes.array,
    selectedCategory: PropTypes.object,
    itemSelected: PropTypes.func.isRequired,
    addCategory: PropTypes.func.isRequired,
    addDisabled: PropTypes.bool,
    deleteCategory: PropTypes.func.isRequired,
    editCategory: PropTypes.func.isRequired,
  };

  static defaultProps = {
    categories: null,
    selectedCategory: null,
    addDisabled: false,
  };

  componentDidUpdate({ categories: prevCategories }) {
    const { categories, selectedCategory } = this.props;

    if (selectedCategory != null && categories != null && categories !== prevCategories) {
      this.updateSelectedCategory();
    }
  }

  updateSelectedCategory = () => {
    const { categories, itemSelected, selectedCategory } = this.props;
    const newSelectedCategory = categories.find(({ id }) => selectedCategory.id === id);

    itemSelected(newSelectedCategory);
  };

  render() {
    const {
      title,
      categories,
      itemSelected,
      selectedCategory,
    } = this.props;

    return (
      <section className="column">
        <header>
          <h2>{ title }</h2>

          <Button
            disabled={this.props.addDisabled}
            round
            raised
            color="green"
            icon="add"
            onClick={() => this.props.addCategory()}
          />
        </header>

        {categories !== null ? (
          <div className="list">
            {categories.length > 0 ? (
              categories.map(category => (
                <div className="list-item-wrapper" key={category.id}>
                  <Button
                    style={{ justifyContent: 'start', width: '100%', zIndex: 1 }}
                    className={`list-item ${get(selectedCategory, 'id') === category.id ? 'selected' : ''}`}
                    onClick={() => itemSelected(category)}
                  >
                    {category.name}
                  </Button>

                  <ActionButtons>
                    <Button
                      style={{ marginRight: '1rem', zIndex: 2 }}
                      round
                      raised
                      icon="edit"
                      color="blue"
                      onClick={() => this.props.editCategory(category)}
                    />

                    <Button
                      style={{ zIndex: 2 }}
                      round
                      raised
                      icon="delete"
                      color="red"
                      onClick={() => this.props.deleteCategory(category)}
                    />
                  </ActionButtons>
                </div>
              ))
            ) : (
              <div className="none-selected">There are no items in this category.</div>
            )}
          </div>
        ) : (
          <div className="none-selected">Select a top category to view subcategories.</div>
        )}
      </section>
    );
  }
}

export default MenuItemsCategoryList;
