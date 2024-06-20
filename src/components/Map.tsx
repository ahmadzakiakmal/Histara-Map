import { MapContainer, Marker, TileLayer, Tooltip, useMap, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import { icon, Icon } from "leaflet";
import { useEffect } from "react";

function Map({
  geojson,
  center,
  markers,
  current,
  image = "1",
}: {
  geojson: any;
  center: [number, number];
  markers: any;
  current: [number, number];
  image: string;
}) {
  const RefreshMapCenter = ({ newCenter }: { newCenter: [number, number] }) => {
    const map = useMap();

    useEffect(() => {
      if (newCenter[0] === 0 && newCenter[1] === 0) {
        console.log("true");
        map.setView(newCenter, map.getZoom());
      }
    }, [newCenter, map]);

    return null;
  };
  return (
    <section className="w-full h-screen relative">
      <MapContainer
        center={center ?? [-7.801363, 110.364787]}
        zoom={15}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <RefreshMapCenter newCenter={center} />
        <TileLayer
          attribution='&copy; <span href="https://www.openstreetmap.org/copyright">OpenStreetMap</span> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers &&
          markers.map((marker: any) => {
            return (
              <Marker
                position={marker.position}
                icon={
                  new Icon({
                    iconUrl: marker.iconUrl,
                    iconSize: marker.iconSize,
                    iconAnchor: marker.iconAnchor,
                  })
                }
                key={marker.key}
              >
                <Tooltip
                  className="!p-0 !bg-transparent !outline-none !border-0"
                  interactive
                  offset={marker.popupAnchor}
                >
                  {marker.children}
                </Tooltip>
              </Marker>
            );
          })}
        {geojson && (
          <GeoJSON
            data={geojson}
            style={(feature) => {
              return {
                color: feature?.properties?.stroke ?? "#000",
                weight: 8,
              };
            }}
          />
        )}
        <Marker
          position={current[0] !== 0 && current[1] !== 0 ? current : center}
          icon={
            new Icon({
              iconUrl: `/profile/${["1", "2", "3", "4"].includes(image) ? image : "1"}.png`,
              iconSize: [50, 50],
            })
          }
        />
      </MapContainer>
    </section>
  );
}

export default dynamic(() => Promise.resolve(Map), {
  ssr: false,
});
