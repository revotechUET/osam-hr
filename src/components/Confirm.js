import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from '@material-ui/core';
import React from 'react';

const Transition = React.forwardRef((props, ref) => {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function Confirm({ label, title, content, onOk, buttonProps }) {
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOk = async () => {
    try {
      await onOk();
      handleClose();
    }
    catch(e) {
      console.error(e);
      handleClose();
    }
  }

  return (
    <>
      <div className="my-button" onClick={() => setOpen(true)} {...buttonProps}>
        {label}
      </div>
      <Dialog
        TransitionComponent={Transition}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        {content &&
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {content}
            </DialogContentText>
          </DialogContent>
        }
        <DialogActions>
          <Button onClick={handleOk} color="primary" autoFocus>
            Ok
          </Button>
          <Button onClick={handleClose} color="">
            Huỷ
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
