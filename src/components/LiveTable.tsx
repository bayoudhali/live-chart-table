import React, { useState } from "react";
import { useLiveChartContext } from "../utils/hooks/useLiveChartContext";
import { RandomEvent } from "../utils/utils";

type EditableCellProps = {
  value: number;
  onChange: (newValue: number) => void;
};

const EditableCell: React.FC<EditableCellProps> = ({ value, onChange }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<number>(value);

  const handleBlur = () => {
    setIsEditing(false);
    onChange(inputValue);
  };

  return isEditing ? (
    <input
      type="number"
      value={inputValue}
      onChange={(e) => setInputValue(Number(e.target.value))}
      onBlur={handleBlur}
      className="border rounded px-2 py-1 w-full"
      autoFocus
    />
  ) : (
    <div className="cursor-pointer" onClick={() => setIsEditing(true)}>
      {value}
    </div>
  );
};

const LiveTable: React.FC = () => {
  const { data, dispatch } = useLiveChartContext();
  const nbTotalEvents = data?.events?.length || 0;
  const eventsFiltered: RandomEvent[] = data.events.slice(
    nbTotalEvents - 20,
    nbTotalEvents
  );

  const handleEdit = (
    index: number,
    field: keyof RandomEvent,
    value: number
  ) => {
    dispatch({
      type: "update_event",
      payload: { index, field, value },
    });
  };

  return (
    <div className="flex border border-gray-300 rounded mb-5">
      <div>
        <div className="p-2">Index</div>
        <div className="p-2 border-t border-gray-300">Value 1</div>
        <div className="p-2 border-t border-gray-300">Value 2</div>
      </div>
      {eventsFiltered.map((event) => (
        <div
          key={event.index}
          className={`border-l border-gray-300 flex-1 ${
            event.index === data.selectedRowIndex ? "bg-blue-100" : ""
          }`}
        >
          <div className="p-2">{event.index}</div>
          <div className="p-2 border-t border-gray-300">
            <EditableCell
              value={event.value1}
              onChange={(newValue) =>
                handleEdit(event.index, "value1", newValue)
              }
            />
          </div>
          <div className="p-2 border-t border-gray-300">
            <EditableCell
              value={event.value2}
              onChange={(newValue) =>
                handleEdit(event.index, "value2", newValue)
              }
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default LiveTable;
