import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';

export default function InputBox(props) {
  const title = props.title || 'Change';
  const prompt = props.prompt || 'Enter a value';
  const label = props.label || 'New value';
  const [data, setData] = React.useState(props.initialValue);

  const handleClose = () => {
    props.onCancel();
  };
  const handleOKClick = (value) => {
    props.onClose(data);
  };
  const handleTextChange = (text) => {
    setData(text);
  }
  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={props.open}>
      <DialogTitle id="simple-dialog-title">
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {prompt}
        </DialogContentText>
        <TextField
          id="name"
          autoFocus
          margin="dense"
          value={data}
          fullWidth
          label={label}
          onFocus={(ev) => {
            ev.target.select()
          }}
          onChange={(ev) => {
            handleTextChange(ev.target.value)
          }}
          onKeyPress={(ev) => {
            if (ev.key === 'Enter') {
              handleOKClick(ev.target.value);
              ev.preventDefault();
            }
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleOKClick}>
          OK
            </Button>
        <Button onClick={handleClose}>
          Cancel
            </Button>
      </DialogActions>
    </Dialog>
  );
}

InputBox.propTypes = {
  onClose: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  initialValue: PropTypes.string,
  title: PropTypes.string,
  prompt: PropTypes.string,
  label: PropTypes.string,
};

