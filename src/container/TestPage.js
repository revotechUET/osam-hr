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
      <textarea value={text} readOnly/>
    </div>
  )
}
