import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import { useState } from "react";
import {
  DatetimeRangeType,
  DeviceLineChartFilters,
  DeviceLineChartFiltersPropType,
} from ".";

export default {
  title: "Forms/DeviceLineChartFilters",
  component: DeviceLineChartFilters,
} as Meta;

const Template: Story<DeviceLineChartFiltersPropType> = ({
  startDateTimeString,
  endDateTimeString,
  onDatetimeRangeChange,
}) => {
  const [
    currentDatetimeRange,
    setCurrentDatetimeRange,
  ] = useState<DatetimeRangeType>({
    startDateTimeString,
    endDateTimeString,
  });
  return (
    <div className='grid place-content-center h-screen'>
      <DeviceLineChartFilters
        startDateTimeString={currentDatetimeRange.startDateTimeString}
        endDateTimeString={currentDatetimeRange.endDateTimeString}
        onDatetimeRangeChange={dateTimeRange => {
          setCurrentDatetimeRange(dateTimeRange);
          onDatetimeRangeChange(dateTimeRange);
        }}
      />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  startDateTimeString: "2021-08-11T13:13:12.000Z",
  endDateTimeString: "2021-08-01T19:19:43.000Z",
  onDatetimeRangeChange: action("onDatetimeRangeChange"),
};
