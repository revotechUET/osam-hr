import React from 'react';
import { DateTimePicker } from "@material-ui/pickers";

export default function DateRangePicker(props) {
    return (
        <div>
            <DateTimePicker
              autoOk clearable={1} fullWidth
              inputVariant='outlined'
              variant='inline'
              ampm={false}
              format="yyyy/MM/dd HH:mm"
              value={props.value.start}
              onChange={date => props.onChange({start: date, end: props.end})}
            />
            <DateTimePicker
              autoOk clearable={1} fullWidth
              inputVariant='outlined'
              variant='inline'
              ampm={false}
              format="yyyy/MM/dd HH:mm"
              value={props.value.end}
              onChange={date => props.onChange({start: props.start, end: date})}
            />
        </div>
    );
}