import React, {
  useContext,
  useReducer,
  createContext,
  ReactNode,
  Dispatch,
} from "react";
import { createRandomEvent, RandomEvent } from "../utils";

type LiveChartState = {
  events: RandomEvent[];
  selectedRowIndex: number | null;
};

type LiveChartAction =
  | { type: "new_event"; payload: RandomEvent }
  | {
      type: "update_event";
      payload: { index: number; field: keyof RandomEvent; value: any };
    }
  | { type: "set_selected_row"; payload: number | null }
  | { type: "reset_events" };

const initialEvents: RandomEvent[] = Array.from(Array(50)).map((_, ix) =>
  createRandomEvent(ix)
);

const initialData: LiveChartState = {
  events: initialEvents,
  selectedRowIndex: null,
};

const LiveChartContext = createContext<{
  data: LiveChartState;
  dispatch: Dispatch<LiveChartAction>;
} | null>(null);

const liveChartReducer = (
  state: LiveChartState,
  action: LiveChartAction
): LiveChartState => {
  switch (action.type) {
    case "new_event":
      return {
        ...state,
        events: [...state.events, action.payload],
      };
    case "update_event": {
      const { index, field, value } = action.payload;
      return {
        ...state,
        events: state.events.map((event) =>
          event.index === index ? { ...event, [field]: value } : event
        ),
      };
    }
    case "set_selected_row":
      return {
        ...state,
        selectedRowIndex: action.payload,
      };
    case "reset_events":
      return {
        ...state,
        events: [...initialEvents],
        selectedRowIndex: null,
      };
    default:
      throw new Error(
        `Unhandled action type: ${(action as LiveChartAction).type}`
      );
  }
};

type LiveChartProviderProps = {
  children: ReactNode;
};

const LiveChartProvider: React.FC<LiveChartProviderProps> = ({ children }) => {
  const [data, dispatch] = useReducer(liveChartReducer, initialData);

  return (
    <LiveChartContext.Provider value={{ data, dispatch }}>
      {children}
    </LiveChartContext.Provider>
  );
};

const useLiveChartContext = () => {
  const context = useContext(LiveChartContext);
  if (!context) {
    throw new Error(
      "useLiveChartContext should be used within a LiveChartProvider"
    );
  }

  return context;
};

export { LiveChartProvider, useLiveChartContext };
