import React from 'react';
import ReactDOM, { Container } from 'react-dom/client';
import { IData, ISetting } from './inteface';
import VirtualScroller from './VirtualScroller.tsx';
import './style.css'

const SETTING: ISetting = {
  itemHeight: 20,
  startIndex: 1,
  minIndex: 1,
  maxIndex: 10000,
  tolerance: 2
}

const getData = (offset: number, limit: number): IData[] => {
  const data: IData[] = [];
  const start: number = Math.max(SETTING.minIndex, offset);
  const end: number = Math.min(offset + limit - 1, SETTING.maxIndex);
  if (start < end) {
    for (let i = start; i <= end; i++) {
      data.push({ index: i, text: `item ${i}`});
    }
  }

  return data;
}

const rowTemplate = (item: IData): React.ReactNode => {
  return (
    <div className='item' key={item.index}>
      {item.text}
    </div>
  )
} 

const App = () => (
  <VirtualScroller getData={getData} settings={SETTING} row={rowTemplate} />
)

const root = ReactDOM.createRoot(document.getElementById('root') as Container);
root.render(<App />);