export type StateValue = string | number | boolean | undefined
export type StateValuesMap = Record<string, StateValue>

export type GetUI = (state: StateValuesMap) => Promise<GetUIResponse>
export interface GetUIResponse {
  ui: Component
}

export type RpcHandler = (state: StateValuesMap) => Promise<StateValuesMap>
export type RpcHandlers = Record<string, RpcHandler>

export interface UIContext {
  ui: Component
  state: StateValuesMap
}

export interface Component {
  com: string
  state?: Record<string, string>
}

export interface Empty extends Component {
  com: 'empty'
}

export interface HStack extends Component {
  com: 'hstack'
  items: Component[]
}

export interface VStack extends Component {
  com: 'vstack'
  items: Component[]
}

export interface Label extends Component {
  com: 'label'
  text: string
}

export interface Tabs extends Component {
  com: 'tabs'
  tabs: string[]
}

export interface Button extends Component {
  com: 'button'
  text: string
  onpress?: string
}

export interface TextInput extends Component {
  com: 'text-input'
  onsubmit?: string
}
