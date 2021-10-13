import { screen, render } from "@testing-library/react";
import { SensorsGrid } from ".";
import { getPublicSensors } from "@lib/hooks/usePublicSensors";
describe("SensorsGrid component", () => {
  it("should render the first sensor", async (): Promise<void> => {
    const sensors = await getPublicSensors();
    if (sensors) render(<SensorsGrid sensors={sensors} />);

    const h1 = screen.getByText(sensors[0].name);
    expect(h1).toBeInTheDocument();
  });
});
