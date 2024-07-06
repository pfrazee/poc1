import { useState, useCallback, createContext, useContext } from 'react'
import { StateValue, StateValuesMap, GetUIResponse } from '@/lib/types'

interface UIRegionContext {
  setBoundState: (key: string, value: StateValue) => void
  callRPCHandler: (handlerKey: string) => Promise<void>
}

export const uiRegionContext = createContext<UIRegionContext>({
  setBoundState(key, value) {},
  async callRPCHandler(handlerKey) {},
})

export function useBoundState<T extends StateValue>(
  initValue: T,
  stateTarget: string | undefined
): [T, (value: T) => void] {
  const ctx = useContext(uiRegionContext)
  const [value, setValue] = useState(initValue)

  const setVWrapped = useCallback(
    (newValue: T) => {
      setValue(newValue)
      if (stateTarget) {
        ctx.setBoundState(stateTarget, newValue)
      }
    },
    [stateTarget, setValue, ctx]
  )

  return [value, setVWrapped]
}

export function useRPCHandler(handlerKey: string | undefined) {
  const ctx = useContext(uiRegionContext)
  return useCallback(() => {
    if (handlerKey) {
      ctx.callRPCHandler(handlerKey)
    }
  }, [handlerKey, ctx])
}
