import { useEffect, useState, useRef, FC } from "react";
import Link from "next/link";
import { PublicProject } from "@lib/hooks/usePublicProjects";
import { ProjectPreviewMap } from "@components/ProjectPreviewMap";
import useIsInViewport from "use-is-in-viewport";
import { AreaPath } from "@components/AreaPath";
import { AccountCircle } from "@material-ui/icons";

export const ProjectPreview: FC<PublicProject> = ({
  id,
  name,
  location,
  description,
  records,
  devicesNumber,
  authorName,
}) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [svgWrapperWidth, setSvgWrapperWidth] = useState(0);
  const [svgWrapperHeight, setSvgWrapperHeight] = useState(0);
  const [isInViewport, mapWrapperRef] = useIsInViewport({ threshold: 50 });

  useEffect(() => {
    const updateWidthAndHeight = (): void => {
      if (parentRef.current === null) return;
      setSvgWrapperWidth(parentRef.current.offsetWidth);
      setSvgWrapperHeight(parentRef.current.offsetHeight);
    };

    window.addEventListener("resize", updateWidthAndHeight);
    updateWidthAndHeight();

    return () => window.removeEventListener("resize", updateWidthAndHeight);
  }, [parentRef]);

  return (
    <div
      ref={parentRef}
      className={[
        "bg-white shadow-lg hover:bg-blue-25",
        "border border-blue-50",
        "cursor-pointer transition rounded-md",
        "relative overflow-hidden group",
      ].join(" ")}
      style={{ paddingBottom: 100 }}
    >
      <Link href={`/${id}`}>
        <a href={`/${id}`} ref={mapWrapperRef}>
          {isInViewport && (
            <div
              className={[
                "absolute -inset-8 pointer-events-none",
                "transition opacity-40 group-hover:opacity-60",
              ].join(" ")}
              style={{
                animationDuration: "1s",
                animationFillMode: "both",
                animationName: "fadeIn",
                animationDelay: "1s",
              }}
            >
              <ProjectPreviewMap
                location={location}
                mapWidth={svgWrapperWidth + 64}
                mapHeight={svgWrapperHeight + 64}
              />
            </div>
          )}
          <div
            className={[
              "absolute inset-0 pointer-events-none",
              "bg-gradient-to-r from-white",
            ].join(" ")}
          />
          <div
            className={[
              "grid sm:grid-cols-2 gap-4",
              "px-4 py-3 sm:px-5 sm:py-4 md:px-8 md:py-7",
              "relative z-10",
            ].join(" ")}
          >
            <div>
              <h3 className='text-blue-500 text-xl sm:text-2xl md:text-3xl font-semibold'>
                {name}
              </h3>
              <p className='mt-4 mb-2 flex gap-2 flex-wrap'>
                <span className='font-bold inline-block'>{location}</span>
                <span className='text-gray-400'>·</span>
                <span className='inline-block'>
                  {devicesNumber} {devicesNumber > 1 ? "Sensoren" : "Sensor"}
                </span>
                {authorName && (
                  <>
                    <span className='text-gray-400'>·</span>
                    <span className='inline-block max-w-full truncate'>
                      <AccountCircle className='mr-2 opacity-40' />
                      {authorName}
                    </span>
                  </>
                )}
              </p>
              <p className='text-base'>{description}</p>
            </div>
          </div>
          <svg
            viewBox={`0 0 ${svgWrapperWidth + 4} 82`}
            xmlns='http://www.w3.org/2000/svg'
            width={svgWrapperWidth + 4}
            height={82}
            className='overflow-visible absolute -bottom-1 -left-1 -right-1'
          >
            <AreaPath
              width={svgWrapperWidth + 4}
              height={82}
              //FIXME: Figure out how we want to handle multiple data points
              data={records}
            />
          </svg>
        </a>
      </Link>
    </div>
  );
};
