import React from 'react';
import { DateTimePicker } from "@material-ui/pickers";
import { Button } from "@material-ui/core"
import "./DateRangePicker.less";
export default function DateRangePicker(props) {
    return (
      <div className="DateRangePicker" style={props.style}>
        {
          props.active ? 
          (<>
            <Button onClick={()=> props.onChange(props.value, false)}><span className="">&gt;</span></Button>
            <DateTimePicker
              autoOk clearable={1} fullWidth
              inputVariant='outlined'
              variant='inline'
              ampm={false}
              format="yyyy/MM/dd HH:mm"
              value={props.value.start}
              onChange={date => props.onChange({start: date, end: props.value.end}, props.active)}
              style={{marginRight: "6px"}}
            />
            <DateTimePicker
              autoOk clearable={1} fullWidth
              inputVariant='outlined'
              variant='inline'
              ampm={false}
              format="yyyy/MM/dd HH:mm"
              value={props.value.end}
              onChange={date => props.onChange({start: props.value.start, end: date}, props.active)}
            />
          </>)
          :
          <Button onClick={()=> props.onChange(props.value, true)}><span className="">&lt;</span></Button>
        }
      </div>
    );
}