import { Story, Meta } from "@storybook/react";

import { ChartThumbnail } from ".";

export default {
  title: "Charts/ChartThumbnail",
  component: ChartThumbnail,
} as Meta;

const Template: Story<{
  width: number;
  height: number;
  data: Array<{
    date: string;
    value: number;
  }>;
}> = args => (
  <svg width={args.width} height={args.height}>
    <ChartThumbnail {...args} />
  </svg>
);

export const Default = Template.bind({});
Default.args = {
  width: 400,
  height: 200,
  data: [
    {
      date: "2021-04-09T12:10:01.908Z",
      value: 10,
    },
    {
      date: "2021-04-08T12:10:01.908Z",
      value: 20,
    },
    {
      date: "2021-04-07T12:10:01.908Z",
      value: 15,
    },
  ],
};
