import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';

export default function HrAutocomplete(props) {
  const { getOptions, options, keyProp = 'id', keyValue, labelProp = 'name', InputProps, ...elementProps } = props;
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

  const getValue = useCallback(() => {
    if (!keyValue && !elementProps.value) return undefined;
    const allOptions = options || _options;
    if (elementProps.multiple) {
      if (!Array.isArray(keyValue)) return [];
      return allOptions.filter(o => keyValue.includes(o[keyProp]));
    } else {
      if (!keyValue) return null;
      return allOptions.find(o => o[keyProp] === keyValue);
    }
  }, [keyValue, options, _options]);

  return (
    <Autocomplete
      disableClearable
      onOpen={() => {
        getOptions && setLoading(true);
      }}
      onClose={() => {
        getOptions && setLoading(false);
      }}
      getOptionSelected={(option, value) => value && option[keyProp] === value[keyProp]}
      getOptionLabel={option => option && option[labelProp] || option}
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
      value={getValue()}
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
