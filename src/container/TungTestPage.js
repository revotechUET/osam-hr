import React, { useCallback, useState } from 'react';
import apiService from '../service/api.service';

export default function TungTestPage() {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('c');
  const onClick = useCallback(async () => {
    console.log("button clicked");
    try {
        const res = await apiService.gscriptrun('getEventsOfThisMonth', {calendarIdx:0});
        setText(JSON.stringify(res, null, '  '));
    }
    catch(e) {
        console.error(e);
    }
  }, []);
  const createEvent = useCallback(async () => {
    console.log("create Event");
    try {
        let now = new Date();
        let date = now.getDate() + 1;
        let start = new Date();
        start.setDate(date);
        start.setHours(8);
        start.setMinutes(0);
        start.setMilliseconds(0);
        let end = new Date(start);
        end.setHours(18);
        const createdEvent = await apiService.gscriptrun('createEvent', {calendarIdx:0, summary, description: "nothing999", start: start.toISOString(), end: end.toISOString()});
    }
    catch (e) {
        console.log(e);
    }
  });
  return (
    <div>
      <button onClick={onClick} style={{padding: '10px 20px', margin: 15, cursor: 'pointer'}}>Test</button>
      <br />
      <textarea cols="100" rows="20" value={text} readOnly />
      <br />
      <input type="text" value={summary} onChange={e => setSummary(e.target.value)} />
      <div>{summary}</div>
      <button onClick={createEvent}>Create</button>
    </div>
  )
}
