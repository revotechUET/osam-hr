import React from 'react';
import { CircularProgress } from '@material-ui/core';

export default function Loading() {
  return (
    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <CircularProgress style={{position: "fixed", top: "50%"}}/>
    </div>
  )
}
