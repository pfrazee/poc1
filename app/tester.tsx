'use client'

import { UIRegion } from '@/com'
import { GetUI, RpcHandlers, StateValuesMap } from '@/lib/types'
import { useState } from 'react'

interface TestCase {
  getUI: GetUI
  handlers: RpcHandlers
}

const TABS_EXAMPLE: TestCase = {
  async getUI({ selectedTab }: StateValuesMap) {
    console.log('TABS render called', { selectedTab })
    selectedTab = selectedTab || 0
    return {
      ui: {
        com: 'vstack',
        items: [
          {
            com: 'tabs',
            tabs: ['First tab', 'Second tab'],
            state: { selected: 'selectedTab' },
          },
          selectedTab === 0 && {
            com: 'label',
            text: 'Tab number 1',
          },
          selectedTab === 1 && {
            com: 'label',
            text: 'Tab number 2',
          },
        ],
      },
    }
  },
  handlers: {},
}

const BUTTON_EXAMPLE: TestCase = {
  async getUI(params: StateValuesMap) {
    console.log('BUTTON render called', params)
    return {
      ui: {
        com: 'hstack',
        items: [
          {
            com: 'button',
            text: 'Press me!',
            onpress: 'onPressed',
          },
          { com: 'label', text: `Presses: ${params.count || 0}` },
        ],
      },
    }
  },
  handlers: {
    async onPressed(params) {
      console.log('BUTTON pressed')
      return {
        count: Number(params.count || 0) + 1,
      }
    },
  },
}

const INPUT_EXAMPLE: TestCase = {
  async getUI(params: StateValuesMap) {
    console.log('INPUT render called', params)
    return {
      ui: {
        com: 'hstack',
        items: [
          {
            com: 'text-input',
            state: { value: 'value' },
          },
          { com: 'label', text: `You entered: ${params.value || ''}` },
        ],
      },
    }
  },
  handlers: {},
}

export function Tester() {
  const [netDelay, setNetDelay] = useState(0)
  return (
    <div style={{ padding: 10 }}>
      <div style={{ marginBottom: '10px' }}>
        <select onChange={(e) => setNetDelay(Number(e.target.value))}>
          <option value="0">Network: Fast (30ms)</option>
          <option value="100">Network: Normal (100ms)</option>
          <option value="300">Network: Slow (300ms)</option>
          <option value="1000">Network: Very slow (1000ms)</option>
        </select>
      </div>

      <h2 style={{ fontWeight: 'bold', fontSize: '21px' }}>Tabs example</h2>
      <div
        style={{
          border: '1px solid gray',
          padding: '10px 12px',
          borderRadius: '4px',
          marginBottom: '10px',
        }}
      >
        <UIRegion netDelay={netDelay} {...TABS_EXAMPLE} />
      </div>
      <h2 style={{ fontWeight: 'bold', fontSize: '21px' }}>Button example</h2>
      <div
        style={{
          border: '1px solid gray',
          padding: '10px 12px',
          borderRadius: '4px',
          marginBottom: '10px',
        }}
      >
        <UIRegion netDelay={netDelay} {...BUTTON_EXAMPLE} />
      </div>
      <h2 style={{ fontWeight: 'bold', fontSize: '21px' }}>Input example</h2>
      <div
        style={{
          border: '1px solid gray',
          padding: '10px 12px',
          borderRadius: '4px',
          marginBottom: '10px',
        }}
      >
        <UIRegion netDelay={netDelay} {...INPUT_EXAMPLE} />
      </div>
    </div>
  )
}
