import React from 'react';
import PropTypes from 'prop-types';

export default function Error(props) {
  if (!props.error) return <></>;
  if (Array.isArray(props.error)) {
    return props.error.map((e, i) => <Error key={i} error={e} />)
  }
  const message = typeof props.error === 'string' ? props.error : props.error.message;
  return (
    <div className="error">{message}</div>
  )
}
Error.propTypes = {
  error: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({ message: PropTypes.string }),
    PropTypes.array,
  ])
}
