import { FC, useEffect, useState } from "react";
import { PublicProject } from "@lib/hooks/usePublicProjects";
import { ViewportType } from "@common/types/ReactMapGl";
import { getGeocodedViewportByString } from "@lib/requests/getGeocodedViewportByString";
import { MarkerMap } from "@components/MarkerMap";

interface LandingHeroBackgroundMapPropType {
  project: PublicProject;
}

type LatLngType = Pick<ViewportType, "latitude" | "longitude">;
const location2ViewportCache: Record<string, LatLngType> = {};

const getElTopOffset = (el: Element): number => {
  const rect = el.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return rect.top + scrollTop + rect.height / 2;
};

export const LandingHeroBackgroundMap: FC<LandingHeroBackgroundMapPropType> = ({
  project,
}) => {
  const [mapHeight, setMapHeight] = useState(1000);
  const [mapWidth, setMapWidth] = useState(1000);
  const [locationViewport, setLocationViewport] = useState<LatLngType | null>(
    null
  );

  useEffect(() => {
    const updateWidthAndHeight = (): void => {
      const slider = document.getElementsByClassName("swiper-wrapper")[0];
      if (!slider) return;

      setMapHeight(getElTopOffset(slider));
      setMapWidth(window.innerWidth);
    };

    updateWidthAndHeight();
    window.addEventListener("resize", updateWidthAndHeight);
    return () => window.removeEventListener("resize", updateWidthAndHeight);
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (!project.location) return;
    const cachedViewport = location2ViewportCache[project.location];

    if (cachedViewport && isMounted) {
      setLocationViewport(cachedViewport);
      return;
    }

    void getGeocodedViewportByString(project.location).then(viewport => {
      if (!project.location || !viewport) return;
      location2ViewportCache[project.location] = {
        latitude: viewport.latitude,
        longitude: viewport.longitude,
      };
      isMounted && setLocationViewport(viewport);
    });
    return () => {
      isMounted = false;
    };
  }, [project.location, locationViewport]);

  if (!locationViewport) return null;
  return (
    <div
      className='relative overflow-hidden pointer-events-none'
      style={{ height: mapHeight }}
    >
      <MarkerMap
        mapWidth={mapWidth}
        mapHeight={typeof mapHeight === "string" ? mapHeight : mapHeight * 1.7}
        clickHandler={() => undefined}
        markers={[
          {
            ...locationViewport,
            isActive: true,
            id: 0,
          },
        ]}
      />
    </div>
  );
};
