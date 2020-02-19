import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types'

export default function HrAutocomplete(props) {
  const { getOptions, options, keyProp = 'id', labelProp = 'name', InputProps, ...elementProps } = props;
  const [_options, setOptions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  getOptions && React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      const options = await getOptions();
      if (!active) return;
      if (Array.isArray(options)) {
        setOptions(options);
      }
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [loading, getOptions]);

  return (
    <Autocomplete
      onOpen={() => {
        getOptions && setLoading(true);
      }}
      onClose={() => {
        getOptions && setLoading(false);
      }}
      getOptionSelected={(option, value) => option[keyProp] === value[keyProp]}
      getOptionLabel={option => option[labelProp] || option}
      options={options || _options}
      loading={loading}
      size='small'
      filterSelectedOptions
      renderInput={params => (
        <TextField
          {...params}
          fullWidth
          variant='outlined'
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          {...InputProps}
        />
      )}
      {...elementProps}
    />
  );
}
HrAutocomplete.propTypes = {
  multiple: PropTypes.bool,
  options: PropTypes.array,
  getOptions: PropTypes.func,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  keyProp: PropTypes.string,
  labelProp: PropTypes.string,
  InputProps: PropTypes.shape(TextField.propTypes)
}
