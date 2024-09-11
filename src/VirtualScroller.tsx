import React, { useEffect, useState } from 'react';
import { IData, ISetting } from './inteface';

const getInitialState = (settings: ISetting) => {
  const { startIndex, minIndex, maxIndex, tolerance, itemHeight } = settings;
  const amount: number = Math.floor(window.innerHeight / itemHeight);
  const viewPortHeight: number = amount * itemHeight;
  const totalHeight: number = (maxIndex - minIndex + 1) * itemHeight;
  const toleranceHeight: number = tolerance * itemHeight;
  const bufferHeight: number = viewPortHeight + 2 * toleranceHeight;
  const bufferItems: number = amount + tolerance * 2;
  const itemsAbove: number = startIndex - tolerance - minIndex;
  const topPaddingHeight: number = itemsAbove * itemHeight;
  const bottomPaddingHeight: number = totalHeight - topPaddingHeight;
  const initialPosition: number = topPaddingHeight + toleranceHeight;

  return {
    settings,
    viewPortHeight,
    totalHeight,
    toleranceHeight,
    bufferHeight,
    bufferItems,
    topPaddingHeight,
    bottomPaddingHeight,
    initialPosition,
    data: [] as IData[]
  }
}
const getNewState = (state, getData, scrollTop) => {
  const { totalHeight, toleranceHeight, bufferItems, settings: { itemHeight, minIndex }} = state || {}
  const index = minIndex + Math.floor((scrollTop - toleranceHeight) / itemHeight)
  const data = getData(index, bufferItems)
  const topPaddingHeight = Math.max((index - minIndex) * itemHeight, 0)
  const bottomPaddingHeight = Math.max(totalHeight - topPaddingHeight - data.length * itemHeight, 0)

  return {
    ...state,
    topPaddingHeight,
    bottomPaddingHeight,
    data
  }
}

const VirtualScroller = ({ getData, settings, row }: IVirtualScoller) => {
  const [state, setState] = useState(() => getInitialState(settings))

  useEffect(() => {
    const runScroller = () => setState(prevState => {
      return getNewState(prevState, getData, window.scrollY)
    })
    window.addEventListener('scroll', runScroller, { passive: true });
    window.scroll(0, state.initialPosition)
    if (!state.initialPosition) {
      runScroller();
    }
    
    return () => window.removeEventListener('scroll', runScroller);
  }, [getData, settings, state.initialPosition])

  return (
    <>
      <div style={{ height: state.topPaddingHeight}}></div>
      {state.data.map(row)}
      <div style={{ height: state.bottomPaddingHeight}}></div>
    </>
  )
}

export default VirtualScroller;

export interface IVirtualScoller {
  getData: (offset: number, limit: number) => void;
  settings: ISetting;
  row: (item: IData) => React.ReactNode;
}