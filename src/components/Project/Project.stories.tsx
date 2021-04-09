import { withNextRouter } from "storybook-addon-next-router";
import { Story, Meta } from "@storybook/react";
import { ThemeProvider } from "theme-ui";
import { StoreProvider } from "easy-peasy";
import { useEffect, FC } from "react";

import theme from "../../style/theme";
import store from "../../state/store";
import { Project } from ".";
import { useStoreActions } from "@state/hooks";

export default {
  title: "Pages/Project",
  component: Project,
  decorators: [withNextRouter],
} as Meta;

const ProjectPage: FC = () => {
  const loadDevices = useStoreActions(action => action.projects.load);

  useEffect(() => {
    loadDevices();
  }, [loadDevices]);

  return <Project />;
};

const Template: Story = () => (
  <StoreProvider store={store}>
    <ThemeProvider theme={theme}>
      <ProjectPage />
    </ThemeProvider>
  </StoreProvider>
);

export const Default = Template.bind({});
Default.args = {};
Default.parameters = {
  nextRouter: {
    query: {
      id: 1,
    },
  },
};
