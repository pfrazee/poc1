'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  StateValue,
  StateValuesMap,
  GetUI,
  RpcHandlers,
  Component,
  Empty,
  HStack,
  VStack,
  Label,
  Tabs,
  Button,
  TextInput,
} from '@/lib/types'
import { useBoundState, useRPCHandler, uiRegionContext } from './hooks'

export function ComEmpty(_props: Empty) {
  return <div />
}

export function ComHStack(props: HStack) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '4px',
      }}
    >
      <MatchComponents items={props.items} />
    </div>
  )
}

export function ComVStack(props: VStack) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <MatchComponents items={props.items} />
    </div>
  )
}

export function ComLabel(props: Label) {
  return <div>{props.text}</div>
}

export function ComTabs(props: Tabs) {
  const [selected, setSelected] = useBoundState(0, props.state?.selected)
  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '4px' }}>
      {props.tabs.map((tab, i) => (
        <div
          key={String(i + tab)}
          style={{
            border: '1px solid black',
            borderRadius: '2px',
            padding: '2px 8px',
            cursor: 'pointer',
            background: selected === i ? 'red' : '',
          }}
          onClick={(e) => setSelected(i)}
        >
          {tab}
        </div>
      ))}
    </div>
  )
}

export function ComButton(props: Button) {
  const onPress = useRPCHandler(props.onpress)
  return (
    <button
      onClick={onPress}
      style={{
        background: '#ccc',
        padding: '2px 4px',
        border: '1px solid #aaa',
        borderRadius: 2,
      }}
    >
      {props.text}
    </button>
  )
}

export function ComTextInput(props: TextInput) {
  const [value, setValue] = useBoundState<string>('', props.state?.value)
  const onSubmit = useRPCHandler(props.onsubmit)

  return (
    <input
      type="text"
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          setValue(e.target.value)
          onSubmit()
        }
      }}
      style={{
        border: '1px solid #aaa',
        borderRadius: 2,
      }}
    />
  )
}

export function MatchComponent(props: Component) {
  switch (props.com) {
    case 'empty':
      return <ComEmpty {...(props as Empty)} />
    case 'hstack':
      return <ComHStack {...(props as HStack)} />
    case 'vstack':
      return <ComVStack {...(props as VStack)} />
    case 'label':
      return <ComLabel {...(props as Label)} />
    case 'tabs':
      return <ComTabs {...(props as Tabs)} />
    case 'button':
      return <ComButton {...(props as Button)} />
    case 'text-input':
      return <ComTextInput {...(props as TextInput)} />
    default:
      return <div>Unknown component: {props.com}</div>
  }
}

export function MatchComponents({ items }: { items: Component[] }) {
  return (
    <>
      {items.map((item, i) =>
        item ? <MatchComponent key={String(i)} {...item} /> : undefined
      )}
    </>
  )
}

export function UIRegion({
  getUI,
  handlers,
  netDelay,
}: {
  getUI: GetUI
  handlers: RpcHandlers
  netDelay: number
}) {
  const [rootCom, setRootCom] = useState<Component>({ com: 'empty' })
  const [stateValuesMap, setStateValuesMap] = useState<StateValuesMap>({})

  useEffect(() => {
    simulateNetworkDelay(netDelay)
      .then(() => getUI(stateValuesMap))
      .then((res) => {
        setRootCom(res.ui)
      })
  }, [stateValuesMap, setRootCom, getUI, netDelay])

  const setBoundState = useCallback(
    (key: string, value: StateValue) => {
      const newStateValuesMap = {
        ...stateValuesMap,
        [key]: value,
      }
      setStateValuesMap(newStateValuesMap)
    },
    [stateValuesMap, setStateValuesMap]
  )

  const callRPCHandler = useCallback(
    async (handlerKey: string) => {
      const handler = handlers[handlerKey]
      if (handler) {
        const updatedState = await simulateNetworkDelay(netDelay).then(() =>
          handler(stateValuesMap)
        )
        setStateValuesMap({ ...stateValuesMap, ...updatedState })
      }
    },
    [stateValuesMap, setStateValuesMap, handlers, netDelay]
  )

  return (
    <uiRegionContext.Provider value={{ setBoundState, callRPCHandler }}>
      <MatchComponent {...rootCom} />
    </uiRegionContext.Provider>
  )
}

async function simulateNetworkDelay(netDelay: number) {
  await new Promise((r) => {
    const delay = (30 + Math.random() * netDelay) | 0
    console.log(`[ Simulating ${delay}ms network latency ]`)
    setTimeout(r, delay)
  })
}
