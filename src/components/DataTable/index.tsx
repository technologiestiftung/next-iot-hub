import React, { useState, useEffect } from "react";
import moment from "moment";
import "moment/locale/de";
import { Button } from "@components/Button";

moment.locale("de-DE");

interface DataTableRowType {
  id: number;
  value: number;
  date: moment.Moment;
}
export interface DataTableType {
  data: DataTableRowType[];
  onRowsDelete?: (ids: number[]) => void | Promise<void>;
}

export const DataTable: React.FC<DataTableType> = ({
  data,
  onRowsDelete = () => undefined,
}) => {
  const [displayedData, setDisplayedData] = useState<DataTableRowType[]>([]);

  const [numberOfRecordsToDisplay, setNumberOfRecordsToDisplay] =
    useState<number>(500);

  useEffect(() => {
    if (!data) return;

    setDisplayedData(
      data.filter((_record, i: number) => i < numberOfRecordsToDisplay)
    );
  }, [data, numberOfRecordsToDisplay]);

  const handleLoadMore = (): void => {
    setNumberOfRecordsToDisplay(numberOfRecordsToDisplay + 500);
  };

  return (
    <div
      className={[
        "border border-gray-200 shadow",
        "bg-white relative overflow-y-scroll",
        "max-h-[500px]",
      ].join(" ")}
    >
      <Button
        onClick={() => {
          void onRowsDelete([displayedData[0].id]);
        }}
      >
        Delete first item
      </Button>
      <table className='w-full p-2 border-collapse'>
        <thead className='sticky top-0 bottom-auto'>
          <tr className='h-8'>
            <th className='text-left p-0 whitespace-nowrap'>
              <span
                className={[
                  "block",
                  "text-left font-headline text-lg",
                  "py-3 px-4 font-normal shadow",
                  "border-r border-gray-200",
                  "border-b bg-white border-gray-200",
                ].join(" ")}
              >
                Datum
              </span>
            </th>
            <th className='text-left p-0 whitespace-nowrap'>
              <span
                className={[
                  "block",
                  "text-left font-headline text-lg",
                  "py-3 px-4 font-normal shadow",
                  "border-r border-gray-200",
                  "border-b bg-white border-gray-200",
                ].join(" ")}
              >
                Uhrzeit (ISO)
              </span>
            </th>
            <th className='text-left p-0 whitespace-nowrap'>
              <span
                className={[
                  "block",
                  "text-left font-headline text-lg",
                  "py-3 px-4 font-normal shadow",
                  "border-b bg-white border-gray-200",
                ].join(" ")}
              >
                Wert
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {displayedData.map((record: DataTableRowType, i: number) => {
            return (
              <tr
                key={record.id}
                className={[
                  "font-mono",
                  i % 2 === 0 ? "bg-white-dot-pattern" : "bg-white",
                ].join(" ")}
              >
                <td className='p-0 whitespace-nowrap'>
                  <span
                    className={[
                      "block text-left",
                      "py-3 px-4 font-normal",
                      "border-r border-gray-200",
                    ].join(" ")}
                  >
                    {record.date.format("DD.MM.YYYY")}
                  </span>
                </td>
                <td className='p-0 whitespace-nowrap'>
                  <span
                    className={[
                      "block text-left",
                      "py-3 px-4 font-normal",
                      "border-r border-gray-200",
                    ].join(" ")}
                  >
                    {record.date.format("HH:mm:ss")}
                  </span>
                </td>
                <td
                  className={[
                    "h-8 px-4 py-3 border-none",
                    "border-b border-gray-200",
                    "whitespace-nowrap",
                  ].join(" ")}
                >
                  {record.value}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {data && data.length > numberOfRecordsToDisplay && (
        <div className='my-3 flex items-center justify-center'>
          <Button variant='secondary' onClick={handleLoadMore}>
            Mehr anzeigen
          </Button>
        </div>
      )}
    </div>
  );
};
