import React, { useEffect, useState } from 'react';
import Odometer from 'odometer';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import './style.css';
import { showMessage } from '../Toast';
import { Typography } from '@material-ui/core';

export interface Props {
  number: number;
  onResult: (roundId: string, result: number[]) => void
};

export interface SlotData {
  value: number;
  instance?: HTMLDivElement;
  odoInstance?: Odometer;
};

function genRoundID() {
  return `${Date.now()}`;
}

const Slot: React.FC<Props> = ({ number, onResult }) => {
  const [slotNumbers, setSlotNumbers] = useState<{[k: string]: SlotData}>({});
  const [roundId, setRoundId] = useState(genRoundID());

  useEffect(() => {
    setSlotNumbers(genSlot(number));
  }, [number]);
  
  function genSlot(numSlot: number) {
    const time = Date.now();
    const slot: {[k: string]: SlotData} = {};
    Array(numSlot).fill(null).forEach((slotValue, index) => {
      slot[`${time}-${index}`] = {
        value: slotValue,
      };
    });
    return slot;
  }

  function roll() {
    return new Promise((resolve, reject) => {
      try {
         // new round
         const newRoundId = genRoundID();
         setRoundId(newRoundId);

        let result: number[] = [];
        const slots = Object.values(slotNumbers);
        slots.forEach(((slotData, index) => {
          setTimeout(() => {
            const randomNum = Math.round(Math.random() * 89 + 10);
            slotData.odoInstance?.update(randomNum);
            result.push(randomNum);
  
            if (index === slots.length - 1) {
              setTimeout(() => {
                showMessage(`Completed round [${newRoundId}] with result ${result.join(' - ')}`);
                setTimeout(() => {
                  onResult(newRoundId, result);
                }, 2000);
              }, 2000);

              return resolve(result);
            }
          }, index * 1500);
        }));
        
      } catch (e) {
        showMessage(e.message);
      }
    });
  }


  return (
    <div className='Slots'>
      <div className='Slots-group'>
        <Typography style={{marginBottom: '10px'}}>ROUND ID: {roundId}</Typography>
        {Object.entries(slotNumbers).map(([slotKey, slotData]) => {
          return (
            <div
              key={slotKey}
              className='odometer Slot'
              ref={instance => {
                if (instance) {
                  const odoInstance = new Odometer({
                    el: instance,
                    value: 88
                  });
                  slotData.odoInstance = odoInstance;
                  slotData.instance = instance;
                }
              }}
            />
          )
        })}
      </div>
      
      <Button
        className='Slots-roll-btn'
        variant="contained"
        color="primary"
        endIcon={<Icon>send</Icon>}
        onClick={roll}
      >LET'S GO</Button>
    </div>
  );
};

export default Slot;