import useCurrentLocation from "@/hooks/useCurrentLocation";
import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import tour1 from "@/data/ambarawa/AM01.json";
import calculateMiddlePoint from "@/utilities/CalculateCentroid";

function AM01() {
  const { location, error } = useCurrentLocation();
  const [centroid, setCentroid] = useState<[number, number]>([0, 0]);
  const chars: string[] = ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];

  const markers: object[] = [];
  tour1.features.forEach((item: any, index: number) => {
    const marker = {
      position: [item.geometry.coordinates[1], item.geometry.coordinates[0]],
      iconUrl: "/" + chars[index + 1] + ".png",
      iconSize: [25, 25],
      iconAnchor: [25, 25/4],
      popupAnchor: [12.5, 12.5],
      children: (
        <div className="font-semibold text-[16px] text-white font-poppins w-max bg-[#84899E] p-2 flex gap-[9px]">
          <div className="w-[60px] h-[55px] bg-[#D9D9D9] rounded-[8px]"></div>
          <p className="max-w-[120px] text-balance">{item.properties.name}</p>
          <div className="bg-white rounded-full text-black self-start size-[30px] flex justify-center items-center">
            {chars[item.properties.index]}
          </div>
        </div>
      ),
      key: item.properties.index,
    };
    if (item.geometry.type === "Point") {
      markers.push(marker);
    }
  });
  const strokeOnlyGeoJson = tour1.features.filter((feature: any) => {
    return feature.geometry.type !== "Point";
  });

  useEffect(() => {
    if (centroid[0] === 0 && centroid[1] === 0) {
      setCentroid(calculateMiddlePoint(markers));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, centroid]);
  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/Map"), {
        ssr: false,
        loading: () => <div>Loading...</div>,
      }),
    []
  );
  return (
    <main>
      {/* <h1 className="bg-white p-10">{location.latitude},&nbsp;{location.longitude}</h1> */}
      <Map
        geojson={strokeOnlyGeoJson}
        center={centroid}
        markers={markers}
        current={[location.latitude, location.longitude]}
      />
    </main>
  );
}

export default dynamic(() => Promise.resolve(AM01), {
  ssr: false,
});
