/** @jsxRuntime classic */
/** @jsx jsx */
import React, { useEffect, useState, useCallback, FC } from "react";
import {
  jsx,
  Grid,
  Container,
  Box,
  Card,
  IconButton,
  Text,
  Input,
  Label,
  Button,
  Theme,
} from "theme-ui";
import { downloadMultiple } from "@lib/downloadCsvUtil";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { ProjectSummary } from "../ProjectSummary";
import { DataTable } from "../DataTable";
import { IconButton as DownloadButton } from "../IconButton";
import { MarkerType, RecordType } from "../../common/interfaces";
import { RadioTabs } from "../RadioTabs";
import { LineChart } from "../LineChart";
import { createDateValueArray } from "@lib/dateUtil";
import { ApiInfo } from "../ApiInfo";
import { MarkerMap } from "../MarkerMap";
import { ViewportType } from "@common/types/ReactMapGl";
import { getGeocodedViewportByString } from "@lib/requests/getGeocodedViewportByString";
import {
  CategoriesType,
  RecordsType,
  ProjectsType,
} from "@common/types/supabase";
import { useRouter } from "next/router";

const downloadIcon = "./images/download.svg";

const rawRecordToRecord = (rawRecord: RecordsType): RecordType => ({
  id: rawRecord.id,
  recordedAt: rawRecord.recordedAt || "",
  value: rawRecord.measurements ? rawRecord.measurements[0] : 0,
});

const getCategoryUnit = (
  category: CategoriesType["name"] | string | undefined
): string => {
  switch (category) {
    case "Temperatur":
      return "°C";
    case "CO2":
      return "ppm";
    case "Luftfeuchtigkeit":
      return "%";
    case "Lautstärke":
      return "dB";
    case "Druck":
      return "hPa";
    case "PAXCounter":
      return "Personen";
    default:
      return "";
  }
};

export const Project: FC<ProjectsType> = project => {
  const router = useRouter();
  const [selectedDeviceIndex, setSelectedDeviceIndex] = useState<number>(0);
  const selectedDevice = project?.devices?.[selectedDeviceIndex];

  const MIN_NUMBER_OF_RECORDS_TO_DISPLAY = 100;

  const [
    numberOfRecordsToDisplay,
    setNumberOfRecordsToDisplay,
  ] = useState<number>(MIN_NUMBER_OF_RECORDS_TO_DISPLAY);

  const [lineChartData, setLineChartData] = useState<RecordType[]>([]);

  const [markerData, setMarkerData] = useState<MarkerType[]>([]);

  const [locationViewport, setLocationViewport] = useState<Pick<
    ViewportType,
    "latitude" | "longitude"
  > | null>(null);

  useEffect(() => {
    const device = project?.devices?.[selectedDeviceIndex];

    if (!device || !device.records) return;

    const initialNumberOfRecordsToDisplay =
      device.records.length < 500 ? device.records.length : 500;
    setNumberOfRecordsToDisplay(initialNumberOfRecordsToDisplay);
  }, [selectedDeviceIndex, project.devices]);

  useEffect(() => {
    const device = project?.devices?.[selectedDeviceIndex];

    if (!device || !device.records) return;

    setLineChartData(
      device.records.slice(0, numberOfRecordsToDisplay).map(rawRecordToRecord)
    );
  }, [selectedDeviceIndex, project.devices, numberOfRecordsToDisplay]);

  useEffect(() => {
    const devicesWithCoordinates = project?.devices?.filter(device => {
      return (
        Boolean(device?.records?.[0]?.latitude) &&
        Boolean(device?.records?.[0]?.longitude)
      );
    });

    if (devicesWithCoordinates?.length === 0 && locationViewport) {
      setMarkerData([
        {
          ...locationViewport,
          id: 0,
          isActive: true,
        },
      ]);
      return;
    }

    setMarkerData(
      devicesWithCoordinates?.map((device, idx) => {
        return {
          latitude: device?.records?.[0].latitude || 0,
          longitude: device?.records?.[0].longitude || 0,
          id: idx,
          isActive: idx === selectedDeviceIndex,
        };
      }) || []
    );
  }, [project.devices, selectedDeviceIndex, locationViewport]);

  const [chartWidth, setChartWidth] = useState<number | undefined>(undefined);
  const [chartHeight, setChartHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    let isMounted = true;
    if (!project.location) return;
    void getGeocodedViewportByString(project.location).then(
      viewport => isMounted && setLocationViewport(viewport)
    );
    return () => {
      isMounted = false;
    };
  }, [project.location]);

  useEffect(() => {
    window.addEventListener("resize", updateChartDimensions);
    return () => {
      window.removeEventListener("resize", updateChartDimensions);
    };
  }, []);

  const chartWrapper = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    setChartWidth(node.getBoundingClientRect().width || 0);
    setChartHeight(node.getBoundingClientRect().width / 2);
  }, []);

  const updateChartDimensions = (): void => {
    const boundingRect: HTMLDivElement | null = document.querySelector(
      "#chart-wrapper"
    );
    if (!boundingRect) return;

    setChartWidth(boundingRect.offsetWidth);
    setChartHeight(boundingRect.offsetWidth / 2);
  };

  const [mapWidth, setMapWidth] = useState<number | undefined>(undefined);
  const [mapHeight, setMapHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    window.addEventListener("resize", updateMapDimensions);
    return () => {
      window.removeEventListener("resize", updateMapDimensions);
    };
  }, []);

  const mapWrapper = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    setMapWidth(node.getBoundingClientRect().width);
    setMapHeight(node.getBoundingClientRect().height);
  }, []);

  const updateMapDimensions = (): void => {
    const boundingRect: HTMLDivElement | null = document.querySelector(
      "#map-wrapper"
    );

    if (!boundingRect) return;
    setMapWidth(boundingRect.offsetWidth);
    setMapHeight(boundingRect.offsetHeight);
  };

  const handleDownload = (): void => {
    if (!project) return;
    downloadMultiple(
      project?.devices?.map(device => {
        return (
          device?.records?.map(rawRecordToRecord) || [
            { id: 0, recordedAt: "", value: 0 },
          ]
        );
      }) || [[{ id: 0, recordedAt: "", value: 0 }]],
      project?.devices?.map(device =>
        device.name ? device.name : "Kein Titel"
      ) || ["Kein Titel"]
    );
  };

  const handleMarkerSelect = (deviceIndex: number): void => {
    setSelectedDeviceIndex(deviceIndex);
  };

  const handleUpdateRecords = (
    event: React.FormEvent<HTMLDivElement>
  ): void => {
    event.preventDefault();

    if (!selectedDevice || !selectedDevice.records) return;
    setLineChartData(
      selectedDevice.records
        .slice(0, numberOfRecordsToDisplay)
        .map(rawRecordToRecord)
    );
  };

  return (
    <Container mt={[0, 5, 5]} p={4}>
      <Grid gap={[4, null, 6]} columns={[1, "1fr 2fr"]}>
        <Box>
          <IconButton
            aria-label='Zurück zur Übersicht'
            bg='background'
            className='rounded-full cursor-pointer'
            onClick={() => router.back()}
            id='back-button'
          >
            <ArrowBackIcon color='primary' />
          </IconButton>
          <Box mt={2}>
            <ProjectSummary
              title={project.name}
              description={project.description || ""}
              noOfDevices={project.devices ? project.devices.length : 0}
            />
          </Box>
          {project && project.devices && project.devices.length > 0 && (
            <>
              <Box mt={4}>
                <ApiInfo
                  entries={project.devices.map(device => {
                    return {
                      name: device.name ? device.name : "Kein Titel",
                      id: device.id,
                    };
                  })}
                />
              </Box>
              <Box mt={4}>
                {project && (
                  <DownloadButton
                    value={"Alle Daten downloaden"}
                    iconSource={downloadIcon}
                    clickHandler={handleDownload}
                  />
                )}
              </Box>
            </>
          )}

          <Card mt={5} bg='muted'>
            <div id='map-wrapper' ref={mapWrapper} className='w-full h-52'>
              {markerData && markerData.length === 0 && (
                <Text>Keine Geoinformationen verfügbar.</Text>
              )}
              {mapWidth &&
                mapHeight &&
                markerData &&
                markerData.length >= 1 && (
                  <MarkerMap
                    markers={markerData}
                    clickHandler={handleMarkerSelect}
                    mapWidth={mapWidth}
                    mapHeight={mapHeight}
                  />
                )}
            </div>
          </Card>
          {project && <Text mt={2}>Standpunkt(e): {project.location}</Text>}
        </Box>
        <Box>
          <Card p={0}>
            {project &&
              project.devices &&
              project.devices[selectedDeviceIndex] && (
                <Grid
                  columns={["auto max-content"]}
                  p={3}
                  sx={{
                    borderBottom: (theme: Theme) =>
                      `1px solid ${String(theme.colors?.lightgrey)}`,
                  }}
                >
                  <RadioTabs
                    name={"devices"}
                    options={project.devices.map((device, idx) => {
                      return {
                        title: device.name ? device.name : "Kein Titel",
                        id: idx,
                        isActive: idx === selectedDeviceIndex,
                      };
                    })}
                    changeHandler={selected => setSelectedDeviceIndex(selected)}
                  />
                  <Box sx={{ fontSize: 0 }}>
                    <Grid
                      as='dl'
                      columns={"100px 1fr"}
                      gap={2}
                      sx={{
                        rowGap: 2,
                        ">dd": {
                          marginLeft: 0,
                        },
                      }}
                    >
                      <dt>Letzter Eintrag:</dt>
                      <dd>
                        {selectedDevice?.records?.length &&
                        // TODO: Do not use hasOwnProperty here
                        // eslint-disable-next-line no-prototype-builtins
                        selectedDevice.records[0].hasOwnProperty("recordedAt")
                          ? new Date(
                              Math.max(
                                ...selectedDevice.records.map(record =>
                                  Date.parse(record.recordedAt || "")
                                )
                              )
                            ).toLocaleDateString()
                          : ""}
                      </dd>
                      <dt>Messwerte:</dt>
                      <dd>
                        {selectedDevice && selectedDevice?.records?.length}
                      </dd>
                    </Grid>
                    {selectedDevice && (
                      <Grid
                        as='form'
                        columns={"100px 1fr auto"}
                        gap={2}
                        onSubmit={handleUpdateRecords}
                      >
                        <Label htmlFor='records-amount'>Angezeigt:</Label>
                        <Input
                          type='number'
                          name='records-amount'
                          value={numberOfRecordsToDisplay}
                          min='1'
                          max={`${selectedDevice?.records?.length || 0}`}
                          step='1'
                          id='records-amount'
                          color='primary'
                          sx={{ fontWeight: "bold" }}
                          onChange={event =>
                            setNumberOfRecordsToDisplay(
                              Number(event.target.value)
                            )
                          }
                        />
                        <Button
                          variant='text'
                          type='submit'
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <ArrowForwardIcon
                            fontSize={"small"}
                            sx={{ color: "primary" }}
                          />
                        </Button>
                      </Grid>
                    )}
                  </Box>
                </Grid>
              )}
            <Box
              id='chart-wrapper'
              ref={chartWrapper}
              className='mt-4'
              style={{ minHeight: 340 }}
            >
              {project &&
                project.devices &&
                project.devices.length > 0 &&
                chartWidth &&
                chartHeight &&
                lineChartData && (
                  <LineChart
                    width={chartWidth}
                    height={chartHeight}
                    yAxisUnit={getCategoryUnit(project.category?.name)}
                    xAxisUnit='Messdatum'
                    data={createDateValueArray(lineChartData)}
                  />
                )}
              {project?.devices?.length === 0 && (
                <div className='prose p-8 max-w-full h-80 grid text-center items-center'>
                  <h3>Dieses Projekt enthält noch keine Sensoren.</h3>
                </div>
              )}
            </Box>
          </Card>
          {selectedDevice && selectedDevice.records && (
            <DataTable
              data={selectedDevice.records.map(rawRecordToRecord)}
              title={selectedDevice.name || ""}
            />
          )}
        </Box>
      </Grid>
    </Container>
  );
};
