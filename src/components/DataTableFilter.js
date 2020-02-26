import { IconButton, InputAdornment, OutlinedInput } from '@material-ui/core';
import React from 'react';

export const DataTableFilter = ({ filterText, onFilter, onClear, placeholder }) => {
  return (
    <>
      <OutlinedInput
        type='text'
        placeholder={placeholder || 'Search...'}
        value={filterText}
        onChange={onFilter}
        endAdornment={
          filterText && filterText.length &&
          <InputAdornment position="end">
            <IconButton onClick={onClear}>
              <div className='ti ti-search'></div>
            </IconButton>
          </InputAdornment>
        }
      />
    </>
  );
}
