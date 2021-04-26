import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Button, { altColors } from './Button';
import { addOrder, openModal } from '@/store/actions';
import LockedSeatWarning from './LockedSeatWarning';

const MenuContainer = styled.div`
  border-right: 2px solid gainsboro;
  min-width: 420px;
  flex-shrink: 0;

  .tabs-content {
    padding-bottom: 15px;
    height: calc(100vh - 110px);
    overflow-y: scroll;
    overflow-x: hidden;

    > div:last-child { padding-bottom: 15px; }

    > div:not(:last-child) .menu::after {
      content: '';
      width: 100%;
      display: block;
      margin: 15px auto;
      background-color: #e2e2e2;
      height: 1px;
    }

    h1 {
      margin: 20px 0 15px 35px;
      font-size: 16px;
      color: #b7b7b7;
      font-weight: 600;
    }

    .menu {
      margin: 0;
      padding: 0;

      .price {
        color: ${altColors.blue};
        border: 1px solid ${altColors.blue};
        border-radius: 10px;
        padding: 0 6px;
        margin-left: 10px;
      }
    }
  }
`;

class Menu extends Component {
  static propTypes = {
    menu: PropTypes.array.isRequired,
    selectedSeat: PropTypes.object.isRequired,
    addOrder: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired,
    style: PropTypes.object,
  };

  static defaultProps = {
    style: {},
  };

  state = {
    activeTab: 0,
  }

  render() {
    return (
      <MenuContainer style={this.props.style}>
        <ul
          style={{
            display: 'flex',
            listStyle: 'none',
            margin: 0,
            padding: 0,
          }}
          role="tablist"
        >
          {this.props.menu.map((topCategory, i) => (
            <li key={topCategory.name} role="presentation" style={{ flex: 1 }}>
              <Button
                tab
                active={this.state.activeTab === i}
                onClick={() => this.setState({ activeTab: i })}
                style={{ height: 50, width: '100%' }}
              >
                {topCategory.name}
              </Button>
            </li>
          ))}
        </ul>

        <section role="tabpanel">
          <div className="tabs-content">
            {this.props.menu[this.state.activeTab].categories.map((category, i) => (
              <div key={i}>
                <h1 className="tab-content-title">{category.name}</h1>
                <ul className="menu">
                  {category.items.length > 0 ? (
                    category.items.map((item, j) => (
                      <Button
                        icon="add"
                        style={{
                          width: '100%',
                          justifyContent: 'flex-start',
                        }}
                        key={j}
                        onClick={() => {
                          this.props.selectedSeat.payments.length > 0
                            ? this.props.openModal(LockedSeatWarning)
                            : this.props.addOrder(item);
                        }}
                      >
                        <span>{item.name}</span>
                        <span className="price">{(item.price / 100).toFixed(2)}</span>
                      </Button>
                    ))
                  ) : (
                    <span className="mui-title empty">&lt; Empty &gt;</span>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </MenuContainer>
    );
  }
}

const mapStateToProps = state => ({
  menu: state.menu,
  selectedSeat: state.selectedTable.seats[state.selectedSeatIndex],
});

const mapDispatchToProps = {
  addOrder,
  openModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
