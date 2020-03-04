import React from 'react';
import { CircularProgress } from '@material-ui/core';

export default function Loading() {
  return (
    <div className="Loading" style={{
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 30,
      backgroundColor: 'rgba(240,240,240,0.5)'
    }}>
      <CircularProgress style={{position: "fixed", top: "50%"}}/>
    </div>
  )
}
