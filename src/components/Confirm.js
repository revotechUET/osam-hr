import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from '@material-ui/core';
import React from 'react';

const Transition = React.forwardRef((props, ref) => {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function Confirm({ label, color = 'primary', title, content, onOk, buttonComponent, actionComponents }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      {buttonComponent ? buttonComponent
        : <Button variant="outlined" color={color} onClick={handleClickOpen}>
          {label}
        </Button>
      }
      <Dialog
        TransitionComponent={Transition}
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
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
          {
            actionComponents ? actionComponents
              : (
                <>
                  <Button onClick={onOk} color="primary" autoFocus>
                    Ok
                  </Button>
                  <Button onClick={handleClose} color="">
                    Huỷ
                  </Button>
                </>
              )
          }
        </DialogActions>
      </Dialog>
    </div>
  )
}
