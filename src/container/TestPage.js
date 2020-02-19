import React, { useCallback, useState } from 'react';
import apiService from '../service/api.service';

export default function TestPage() {
  const [text, setText] = useState('');
  const onClick = useCallback(async () => {
    const res = await apiService.gscriptrun('test');
    setText(JSON.stringify(res, null, '  '));
  }, []);
  return (
    <div>
      <button onClick={onClick}>Test</button>
      <br/>
      <textarea cols="100" rows="20" value={text} readOnly/>
    </div>
  )
}
