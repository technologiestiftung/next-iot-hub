import { FC } from "react";
import { SensorsGrid } from "@components/SensorsGrid";
import { GetServerSideProps } from "next";
import { ParsedSensorType } from "@lib/hooks/usePublicSensors";
import { Pagination } from "@components/Pagination";
import router from "next/router";
import classNames from "classnames";
import { getLandingStats } from "@lib/requests/getLandingStats";
import { getPublicSensors } from "@lib/requests/getPublicSensors";

interface SensorsOverviewPropType {
  sensors: ParsedSensorType[];
  sensorsCount: number;
  page: number;
}

const MAX_SENSORS_PER_PAGE = 15;

const getRangeByPageNumber = (page: number): [number, number] => {
  const rangeStart = (page - 1) * MAX_SENSORS_PER_PAGE;
  const rangeEnd = rangeStart + MAX_SENSORS_PER_PAGE - 1;
  return [rangeStart, rangeEnd];
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const page = Array.isArray(query.page) ? 1 : Number.parseInt(query.page) || 1;
  const [rangeStart, rangeEnd] = getRangeByPageNumber(page);
  try {
    const sensors = await getPublicSensors({ rangeStart, rangeEnd });
    const { sensorsCount } = await getLandingStats();
    return { props: { sensors, sensorsCount, page } };
  } catch (error) {
    console.error("Error when fetching sensors:");
    console.error(error);
    return { notFound: true };
  }
};

const handlePageChange = ({ selected }: { selected: number }): void => {
  const path = router.pathname;
  const query = selected === 0 ? "" : `page=${selected + 1}`;
  void router.push({
    pathname: path,
    query: query,
  });
};

const SensorsOverview: FC<SensorsOverviewPropType> = ({
  sensors,
  sensorsCount,
  page,
}) => {
  if (!sensors || sensors.length === 0)
    return (
      <h1 className='flex justify-center mt-32'>Keine Sensordaten vorhanden</h1>
    );

  const pageCount = Math.ceil(sensorsCount / MAX_SENSORS_PER_PAGE);

  return (
    <div className='container mx-auto max-w-8xl py-24 px-4'>
      <hgroup
        className={classNames(
          "sm:mt-1 md:mt-2",
          "mb-4 sm:mb-5 md:mb-6",
          "flex place-content-between"
        )}
      >
        <h1
          className={[
            "font-bold text-xl sm:text-2xl md:text-3xl font-headline",
          ].join(" ")}
        >
          Alle Sensoren
        </h1>
        <h2 className='text-gray-600 mt-0 md:mt-2'>
          Seite {page} von {pageCount}
        </h2>
      </hgroup>
      <SensorsGrid sensors={sensors} />
      <div className='mt-12 flex justify-center'>
        <Pagination
          pageCount={pageCount}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          currentPage={page}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default SensorsOverview;
