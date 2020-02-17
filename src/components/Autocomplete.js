import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes  from 'prop-types'

export default function HrAutocomplete(props) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = open && options.length === 0;

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      const options = await props.getOptions();
      if (active && Array.isArray(options)) {
        setOptions(options);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);
  const { keyName = 'name' } = props;
  return (
    <Autocomplete
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionSelected={(option, value) => option[keyName] === value[keyName]}
      getOptionLabel={option => option[keyName]}
      options={options}
      loading={loading}
      renderInput={params => (
        <TextField
          {...params}
          fullWidth
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          {...props.inputProps}
        />
      )}
      {...props}
    />
  );
}
HrAutocomplete.propTypes = {
  getOptions: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  keyName: PropTypes.string,
  inputProps: PropTypes.shape(TextField.propTypes),
}
