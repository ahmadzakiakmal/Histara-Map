/* eslint-disable @next/next/no-img-element */
import useCurrentLocation from "@/hooks/useCurrentLocation";
import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import tour1 from "@/data/magelang/MG01.json";
import calculateMiddlePoint from "@/utilities/CalculateCentroid";

function MG01() {
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
          <div className="w-[90px] h-[75px] bg-[#D9D9D9] rounded-[8px] overflow-hidden  relative justify-center items-center">
            <img 
              className="absolute h-full"
              src={
                process.env.NEXT_PUBLIC_ENV === "DEV"
                  ? "http://localhost:3000/images/MG01-" + (item.properties.index < 10 ? "0" : "") + item.properties.index + ".png"
                  : "https://histara-map.vercel.app/images/MG01-" + (item.properties.index < 10 ? "0" : "") + item.properties.index + ".png"
              }
              // src="https://drive.google.com/uc?export=view&id=1dhy2mj-fc30pPB2giZ_ztvSCINf88FuD"
              alt={"Photo of " + item.properties.name}
            />
          </div>
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
image="1"
        geojson={strokeOnlyGeoJson}
        center={centroid}
        markers={markers}
        current={[location.latitude, location.longitude]}
      />
    </main>
  );
}

export default dynamic(() => Promise.resolve(MG01), {
  ssr: false,
});
