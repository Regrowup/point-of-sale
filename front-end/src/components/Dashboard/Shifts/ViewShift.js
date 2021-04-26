import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@/components/Button';
import { printReadout } from '@/store/actions';
import Modal from '@/components/ModalPortal';

function ViewShift(props) {
  return (
    <Modal title={`${props.shift.server.name}'s shift`}>
      <div content={1}>
        <pre style={{ background: 'snow', padding: '1rem' }}>{props.readout}</pre>
      </div>

      <Button
        color="blue"
        cancelButton
        onClick={() => props.closeModal()}
      >GO BACK
      </Button>

      <Button
        raised
        okButton
        color="blue"
        onClick={() => props.printReadout({ shift: props.shift })}
      >PRINT READOUT
      </Button>
    </Modal>
  );
}

ViewShift.propTypes = {
  closeModal: PropTypes.func.isRequired,
  printReadout: PropTypes.func.isRequired,
  readout: PropTypes.string.isRequired,
  shift: PropTypes.object.isRequired,
};

const mapDispatchToProps = {
  printReadout,
};

export default connect(null, mapDispatchToProps)(ViewShift);
