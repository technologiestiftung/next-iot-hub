import { DatetimeRangePicker } from "@components/DatetimeRangePicker";
import { RadioFieldset } from "@components/RadioFieldset";
import moment from "moment";
import { FC, useState } from "react";

type FilterType = "devicesByTimespan" | "devicesByDatetimeRange";
type TimespanType = "today" | "week" | "month" | "all";

export interface DatetimeRangeType {
  startDateTimeString: string | undefined;
  endDateTimeString: string | undefined;
}

export interface DeviceLineChartFiltersPropType extends DatetimeRangeType {
  onDatetimeRangeChange: (vals: DatetimeRangeType) => void;
}

interface GetTimeRangeByFiltersReturnType {
  startDateTimeString: string | undefined;
  endDateTimeString: string | undefined;
}

const getTimeRangeByTimespan = (
  timespan: TimespanType
): GetTimeRangeByFiltersReturnType => {
  const todayMoment = moment().endOf("day");
  const todayISOString = todayMoment.toISOString();
  switch (timespan) {
    case "today":
      return {
        startDateTimeString: moment().startOf("day").toISOString(),
        endDateTimeString: todayISOString,
      };
    case "week":
      return {
        startDateTimeString: moment()
          .subtract(1, "week")
          .startOf("day")
          .toISOString(),
        endDateTimeString: todayISOString,
      };
    case "month":
      return {
        startDateTimeString: moment()
          .subtract(1, "month")
          .startOf("day")
          .toISOString(),
        endDateTimeString: todayISOString,
      };
    default:
      return {
        startDateTimeString: undefined,
        endDateTimeString: undefined,
      };
  }
};

interface TemporalityButtonPropType {
  isActive?: boolean;
  isFirst?: boolean;
  onClick: () => void;
}

const TemporalityButton: FC<TemporalityButtonPropType> = ({
  isActive = false,
  isFirst = false,
  onClick,
  children,
}) => (
  <button
    className={[
      "border border-gray-200 px-4 py-2 text-sm relative transition",
      "focus:outline-none focus:ring-2 focus:border-purple focus:ring-purple focus:z-30",
      "focus:ring-offset focus:ring-offset-white focus:ring-offset-2",
      !isActive &&
        "hover:bg-purple hover:bg-opacity-10 hover:text-purple hover:border-purple hover:z-10",
      !isFirst && "ml-[-1px]",
      isActive && "bg-blue border-blue text-white z-20",
    ]
      .filter(Boolean)
      .join(" ")}
    onClick={evt => {
      evt.preventDefault();
      onClick();
    }}
  >
    {children}
  </button>
);

export const DeviceLineChartFilters: FC<DeviceLineChartFiltersPropType> = ({
  startDateTimeString,
  endDateTimeString,
  onDatetimeRangeChange,
}) => {
  const [activeFilterType, setActiveFilterType] = useState<FilterType>(
    "devicesByTimespan"
  );
  const [temporalityOfRecords, setTemporaityOfRecords] = useState<TimespanType>(
    "today"
  );
  const weekTimeRange = getTimeRangeByTimespan("week");
  return (
    <div className='border-b border-gray-100 shadow p-4 flex flex-wrap gap-8'>
      <RadioFieldset
        isSelected={activeFilterType === "devicesByTimespan"}
        label='Messwerte bei Zeitraum'
        name='devicesByTimespan'
        onSelect={() => setActiveFilterType("devicesByTimespan")}
      >
        <div className='flex'>
          <TemporalityButton
            isActive={
              activeFilterType === "devicesByTimespan" &&
              temporalityOfRecords === "today"
            }
            isFirst
            onClick={() => {
              setTemporaityOfRecords("today");
              onDatetimeRangeChange(getTimeRangeByTimespan("today"));
            }}
          >
            Heute
          </TemporalityButton>
          <TemporalityButton
            isActive={
              activeFilterType === "devicesByTimespan" &&
              temporalityOfRecords === "week"
            }
            onClick={() => {
              setTemporaityOfRecords("week");
              onDatetimeRangeChange(getTimeRangeByTimespan("week"));
            }}
          >
            Woche
          </TemporalityButton>
          <TemporalityButton
            isActive={
              activeFilterType === "devicesByTimespan" &&
              temporalityOfRecords === "month"
            }
            onClick={() => {
              setTemporaityOfRecords("month");
              onDatetimeRangeChange(getTimeRangeByTimespan("month"));
            }}
          >
            Monat
          </TemporalityButton>
          <TemporalityButton
            isActive={
              activeFilterType === "devicesByTimespan" &&
              temporalityOfRecords === "all"
            }
            onClick={() => {
              setTemporaityOfRecords("all");
              onDatetimeRangeChange(getTimeRangeByTimespan("all"));
            }}
          >
            Alle
          </TemporalityButton>
        </div>
      </RadioFieldset>
      <RadioFieldset
        isSelected={activeFilterType === "devicesByDatetimeRange"}
        label='Messwerte bei Zeitspanne'
        name='devicesByDatetimeRange'
        onSelect={() => setActiveFilterType("devicesByDatetimeRange")}
      >
        <DatetimeRangePicker
          startDateTimeString={
            startDateTimeString ||
            weekTimeRange.startDateTimeString ||
            moment().toISOString()
          }
          endDateTimeString={
            endDateTimeString ||
            weekTimeRange.endDateTimeString ||
            moment().toISOString()
          }
          onDatetimeRangeChange={onDatetimeRangeChange}
          tabIndex={activeFilterType === "devicesByDatetimeRange" ? 0 : -1}
        />
      </RadioFieldset>
    </div>
  );
};
