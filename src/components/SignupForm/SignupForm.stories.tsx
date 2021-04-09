import { Story, Meta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { ThemeProvider } from "theme-ui";

import theme from "../../style/theme";
import { SignupForm } from ".";

export default {
  title: "Forms/Signup",
  argTypes: {
    onSubmit: {
      description: "A callback called when the form has submitted",
    },
  },
} as Meta;

const Template: Story<{
  onSubmit?: () => void;
}> = args => (
  <ThemeProvider theme={theme}>
    <SignupForm {...args} />
  </ThemeProvider>
);

export const Default = Template.bind({});
Default.args = {
  onSubmit: action("Form data submited"),
};
