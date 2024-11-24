import React, { useEffect, useRef, useState } from "react";

import { createRandomEvent, RandomEvent } from "../utils/utils";
import Content from "./Content";
import {
  LiveChartProvider,
  useLiveChartContext,
} from "../utils/hooks/useLiveChartContext";

type DispatchAction =
  | { type: "new_event"; payload: RandomEvent }
  | { type: "reset_events" };

const ContainerContent: React.FC = () => {
  const currentIndex = useRef<number>(50);
  const { dispatch } = useLiveChartContext() as {
    dispatch: (action: DispatchAction) => void;
  };
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const intervalId = useRef<NodeJS.Timeout | null>(null);

  const startLiveUpdate = () => {
    if (!intervalId.current) {
      intervalId.current = setInterval(() => {
        dispatch({
          type: "new_event",
          payload: createRandomEvent(++currentIndex.current),
        });
      }, 2000);
    }
  };

  const stopLiveUpdate = () => {
    if (intervalId.current) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }
  };

  useEffect(() => {
    if (isPlaying) {
      startLiveUpdate();
    } else {
      stopLiveUpdate();
    }

    return () => stopLiveUpdate();
  }, [isPlaying, dispatch]);

  const handleReset = () => {
    dispatch({ type: "reset_events" });
    setIsPlaying(true);
  };

  return (
    <div className="relative w-full">
      <div className="flex justify-between items-center mb-4 mx-auto max-w-6xl px-0">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            value=""
            className="sr-only peer"
            checked={isPlaying}
            onChange={() => setIsPlaying(!isPlaying)}
          />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            {isPlaying ? "Pause" : "Play"}
          </span>
        </label>
        <button
          onClick={handleReset}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Reset All
        </button>
      </div>
      <Content />
    </div>
  );
};

const Container: React.FC = () => {
  return (
    <LiveChartProvider>
      <ContainerContent />
    </LiveChartProvider>
  );
};

export default Container;
