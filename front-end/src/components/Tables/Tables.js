import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Button from '@/components/Button';
import Table from '@/components/Table';
import PinSelect from '@/components/PinSelect';
import './Tables.scss';
import {
  getLayouts,
  setSelectedSeatIndex,
  setSelectedServer,
  setSelectedLocation,
  printReadout,
  getTable,
  clockIn,
  clockOut
} from '@/store/actions';
import getSelectedLayout from '@/store/selectors';
import NavBar from '@/components/NavBar';

const TablesContainer = styled.div`
display: flex;
  flex-direction: column;
  background-color: #e0e0e0;
  height: 100%;
`;

const FloorMap = styled.div`
  display: grid;
  flex: 1;
  grid-template-columns: ${props => `repeat(${props.columns}, minmax(0, 1fr))`};
  grid-auto-rows: minmax(0, 1fr);
  margin: 1rem;
  grid-gap: 1rem;
  align-items: center;
  justify-items: center;
`;

class Tables extends Component {
  static propTypes = {
    layout: PropTypes.object,
    getLayouts: PropTypes.func.isRequired,
    setSelectedSeatIndex: PropTypes.func.isRequired,
    setSelectedServer: PropTypes.func.isRequired,
    setSelectedLocation: PropTypes.func.isRequired,
    printReadout: PropTypes.func.isRequired,
    history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
    getTable: PropTypes.func.isRequired,
    clockIn: PropTypes.func.isRequired,
    clockOut: PropTypes.func.isRequired,
  };

  static defaultProps = {
    layout: { locations: [] },
  };

  state = {
    pinAction: null,
  };

  componentDidMount() {
    this.props.getLayouts();
  }

  printReadout = ({ server, closeModal }) => {
    this.props.printReadout({ server });
    closeModal();
  }

  enterDashboard = ({ server, resetPin }) => {
    if (server.is_admin) {
      this.props.setSelectedServer(server);
      this.props.history.push('/dashboard');
    } else {
      resetPin('You don\'t have access to the dashboard.');
    }
  }

  openTable = async ({ server, resetPin }, location) => {
    const table = location.table;
    if (!table) {
      this.props.setSelectedSeatIndex(0);
      this.props.setSelectedServer(server);
      this.props.setSelectedLocation(location);
      await this.props.getTable();
      this.props.history.push('/table/new/');
      return;
    }

    /* The pin corresponds to a user, but the user doesn't have access to the table */
    if (!server.is_admin && server.name !== table.server.name) {
      resetPin('You don\'t have access to this table.');
      return;
    }

    /* The user is an admin, or the server assigned to the table */
    this.props.setSelectedServer(server);
    this.props.setSelectedLocation(location);
    await this.props.getTable(table.id);
    this.props.history.push(`/table/${table.id}`);
  }

  clockIn = ({ server, closeModal }) => {
    this.props.clockIn(server);
    closeModal();
  }

  clockOut = ({ server, closeModal }) => {
    this.props.clockOut(server);
    closeModal();
  }

  render() {
    return (
      <TablesContainer>
        <NavBar>
          <Button raised onClick={() => this.setState({ pinAction: this.enterDashboard })}>
            Dashboard
          </Button>

          <Button
            raised
            onClick={() => this.setState({ pinAction: this.clockIn })}
            style={{ marginLeft: 'auto' }}
          >Clock In
          </Button>

          <Button
            raised
            onClick={() => this.setState({ pinAction: this.clockOut })}
            style={{ marginLeft: '1rem' }}
          >Clock Out
          </Button>

          <Button
            raised
            onClick={() => this.setState({ pinAction: this.printReadout })}
            style={{ marginLeft: '1rem' }}
          >Print Readout
          </Button>
        </NavBar>

        <FloorMap columns={this.props.layout.cols}>
          {this.props.layout.locations.map(location => (
            <Table
              key={location.id}
              location={location}
              onClick={() => this.setState({ pinAction: options => this.openTable(options, location) })}
            />
          ))}
        </FloorMap>

        <PinSelect
          open={this.state.pinAction != null}
          closeModal={() => this.setState({ pinAction: null })}
          pinAction={this.state.pinAction}
        />
      </TablesContainer>
    );
  }
}

const mapStateToProps = state => ({
  layout: getSelectedLayout(state),
});

const mapDispatchToProps = {
  getLayouts,
  setSelectedServer,
  setSelectedSeatIndex,
  setSelectedLocation,
  printReadout,
  getTable,
  clockIn,
  clockOut,
};

export default connect(mapStateToProps, mapDispatchToProps)(Tables);
