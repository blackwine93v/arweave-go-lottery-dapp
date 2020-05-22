import React, {useState} from 'react';
import Slot from './components/Slot';
import Toast, { showMessage } from './components/Toast';
import Slider from '@material-ui/core/Slider';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import UploadKey from './components/UploadKey';
import { wallet } from './services/wallet';
import './App.css';

function valuetext(value: number) {
  return `${value} slots`;
}

function App() {
  const [slotNumber, setSlotNumber] = useState(3);
  const marks = [
    {
      value: 1,
      label: '1 slot',
    },
    {
      value: 2,
      label: '2 slots',
    },
    {
      value: 3,
      label: '3 slots',
    },
    {
      value: 4,
      label: '4 slots',
    },
  ];

  const handleStoreResult = async (roundId: string, result: number[]) => {
    try {
      const res = await wallet.createTXStoreResult(roundId, JSON.stringify(result));
      if (res.status === 200) {
        showMessage(`Yay!!! The result was stored on chain.`);
      }
    } catch (e) {
      showMessage('The result was not stored on chain.');
    }
  };

  return (
    <Container className='App'>
      <Slot number={slotNumber} onResult={handleStoreResult}/>
      <div className='App-control'>
        <Typography id="discrete-slider" gutterBottom>
          Mode
        </Typography>
        <Slider
          className='App-slider-slot-num'
          defaultValue={slotNumber}
          getAriaValueText={valuetext}
          onChange={(e, num) => typeof num === 'number' && setSlotNumber(num)}
          aria-labelledby="discrete-slider"
          valueLabelDisplay="auto"
          step={1}
          marks={marks}
          min={1}
          max={4}
        />
      </div>
      <UploadKey />
      <Toast />
    </Container>
  );
}

export default App;
