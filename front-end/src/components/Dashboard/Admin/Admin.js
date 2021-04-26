import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Button from '@/components/Button';
import { downloadDatabaseBackup, restoreFromDatabaseBackup } from '@/store/actions';

const AdminContainer = styled.div`
  background: #fff;
  width: 100%;
  max-width: 800px;
  margin: 1rem auto;
  padding: 1rem;
`;

class Admin extends Component {
  static propTypes = {
    downloadDatabaseBackup: PropTypes.func.isRequired,
    restoreFromDatabaseBackup: PropTypes.func.isRequired,
  }

  downloadDatabaseBackup = () => {
    this.props.downloadDatabaseBackup();
  };

  restoreFromDatabaseBackup = () => {
    const file = this.fileInput.files[0];

    if (!file) {
      return;
    }

    this.props.restoreFromDatabaseBackup(file);
  };

  triggerFileSelect = () => {
    this.fileInput.click();
  };

  render() {
    return (
      <AdminContainer>
        <h1>Admin Tools</h1>

        <hr />

        <p>
          Download a backup of all the data in the database.
          The generated file can then be used to restore the application database.
        </p>
        <Button
          color="blue"
          raised
          icon="save"
          onClick={this.downloadDatabaseBackup}
        >Download database backup
        </Button>

        <hr />

        <p>
          Restore the database from a previous backup. Any data not backed up will be permanantly lost.
        </p>
        <Button
          color="red"
          raised
          icon="settings_backup_restore"
          onClick={this.triggerFileSelect}
        >Restore from database backup
        </Button>

        <input
          style={{ display: 'none' }}
          type="file"
          ref={ref => this.fileInput = ref}
          accept="application/sql"
          onChange={this.restoreFromDatabaseBackup}
        />
      </AdminContainer>
    );
  }
}

const mapDispatchToProps = {
  downloadDatabaseBackup,
  restoreFromDatabaseBackup,
};

export default connect(null, mapDispatchToProps)(Admin);
