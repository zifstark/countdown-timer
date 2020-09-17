import React, { useReducer, useEffect } from 'react';
import { 
  Input, DatePicker,TimePicker,
  Space, Button, Card, Col, Row,
} from 'antd';
import styled from 'styled-components';

const Container = styled.div`
  padding: 30px;
  background-color: #0a4245;
  height: 100vh;
  margin: 0 auto;
`;

const styles = {
  centeredContainer: maxWidth => ({ maxWidth, margin: '0 auto'}),
}

function reducer(state, action) {
  switch(action.type) {
    case 'START_COUNTER':
      return { 
        ...state, 
        counters: [
          ...state.counters,
          {
            ...state.form
          }, 
        ]
      }
    case 'SET_EVENT':
      return { ...state, form: { ...state.form, event: action.value } }
    case 'SET_DATE':
      return { ...state, form: { ...state.form, date: action.value }}
    case 'SET_TIME':
      return { ...state, form: { ...state.form, time: action.value }}
    case 'UPDATE_SECONDS':
      return { ...state, secondsCount: state.secondsCount + 1 }
    case 'CLEAR_FORM':
      return { ...state, form: {...state.form, event: '' }}
    default:
      return state;
  }
}

const initialState = {
  counters: [
  ],
  secondsCount: 0,
  form: {
    event: '',
    date: '',
    time: '00:00:00'
  }
};

function isTimeout(millisecondsLeft) {
  return millisecondsLeft <= 0
}

function milliSecondsLeft(dateString, timeString) {
  const now = new Date();
  const after = new Date(`${dateString}T${timeString}`);
  const millisecondsLeft = after.getTime() - now.getTime();
  return millisecondsLeft;
}

function timeLeft(dateString, timeString) {
  const millisecondsLeft = milliSecondsLeft(dateString, timeString);
  if(isTimeout(millisecondsLeft)) return "it'time!!"
  const secondsLeft = Math.round(millisecondsLeft / 1000);
  const seconds = secondsLeft % 60;

  const minutesLeft = (secondsLeft - seconds) / 60;
  const minutes = minutesLeft % 60;

  const hoursLeft = (minutesLeft - minutes) / 60;
  const hours = hoursLeft % 24;

  const days = (hoursLeft - hours) / 24;

  return `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds left`;
}

function styleOnTimeout(dateString, timeString) {
    if (!isTimeout(milliSecondsLeft(dateString, timeString))) return {}
    return { border: 'solid 5px #f77a05', color: '#f77a05'};
}


function App() {
  function onEventChange(e) {
    dispatch({
      type: 'SET_EVENT',
      name: e.target.name,
      value: e.target.value,
    })
  }
  
  
  function onDateChange(_, dateString) {
    dispatch({
      type: 'SET_DATE',
      value: dateString
    })
  }

  function onTimeChange(_, timeString) {
    dispatch({
      type: 'SET_TIME',
      value: timeString,
    })
  }
  
  function startCounter() {
    dispatch({ type: 'START_COUNTER' });
    dispatch({ type: 'CLEAR_FORM' });
  }

  const [state, dispatch] = useReducer(reducer, initialState);
  const { event, date, time } = state.form; 

  useEffect(() => {
    const timerId = setInterval(() => {
      dispatch({type: 'UPDATE_SECONDS'});
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  return (
    <Container>
      <div style={styles.centeredContainer("1000px")}>
      <div style={styles.centeredContainer("600px")}>
        <Space>
          <Input 
            placeholder="Event name" 
            onChange={onEventChange}
            value={state.form.event}
            name="event"
          />
          <DatePicker 
            onChange={onDateChange}
            name="date"
          />
          <TimePicker onChange={onTimeChange} />
          <Button disabled={!(event && date && time)} onClick={startCounter} type="primary">Start</Button>
        </Space>
      </div>
        <section style={{marginTop: '10px'}}>
          <Row gutter={16}>
            {state.counters.map((c, i) => 
              <Col key={c.event + i} span={6} style={{marginTop: '10px'}}>
                <Card style={styleOnTimeout(c.date, c.time)} title={c.event} bordered={false}>
                  <p>{c.date} {c.time}</p>
                  <p><b>{timeLeft(c.date, c.time)}</b> </p>
                </Card>
              </Col>
            )}
          </Row>  
        </section>
      </div>
    </Container>
  );
}

export default App;
