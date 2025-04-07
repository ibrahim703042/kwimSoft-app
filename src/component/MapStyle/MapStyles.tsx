import React from "react";
import SateliteStreets from "../../assets/img/type-satelliteStreets.png";
import Satelite from "../../assets/img/type-satellite.png";
import Default from "../../assets/img/type-street.png";
import Dark from "../../assets/img/type-dark.png";
import Light from "../../assets/img/type-light.png";
import Outdoors from "../../assets/img/type-outdoor.png";
import TrafficDay from "../../assets/img/type-trafficday.jpeg.jpg";
import TrafficNight from "../../assets/img/type-trafficnight.jpeg.jpg";
import Streets from "../../assets/img/type-street.png";

type MapStyleItem = {
  style: string;
  name: string;
  imageSrc: string;
};

type MapStylesProps = {
  mapStyle: MapStyleItem | null;
  setMapStyle: (style: MapStyleItem) => void;
  setStylesVisible: (visible: boolean) => void;
};

const styles: MapStyleItem[] = [
  {
    style: "mapbox://styles/mapbox/streets-v12",
    name: "Default",
    imageSrc: Default,
  },
  {
    style: "mapbox://styles/mapbox/satellite-v9",
    name: "Satellite",
    imageSrc: Satelite,
  },
  {
    style: "mapbox://styles/mapbox/satellite-streets-v12",
    name: "Satellite streets",
    imageSrc: SateliteStreets,
  },
  {
    style: "mapbox://styles/mapbox/light-v11",
    name: "Light",
    imageSrc: Light,
  },
  {
    style: "mapbox://styles/mapbox/dark-v11",
    name: "Dark",
    imageSrc: Dark,
  },
  {
    style: "mapbox://styles/mapbox/outdoors-v12",
    name: "Outdoors",
    imageSrc: Outdoors,
  },
  {
    style: "mapbox://styles/mapbox/navigation-day-v1",
    name: "TrafficDay",
    imageSrc: TrafficDay,
  },
  {
    style: "mapbox://styles/mapbox/navigation-night-v1",
    name: "TrafficNight",
    imageSrc: TrafficNight,
  },
  {
    style: "mapbox://styles/mapbox/streets-v9",
    name: "Streets",
    imageSrc: Streets,
  },
];

const MapStyles: React.FC<MapStylesProps> = ({
  mapStyle,
  setMapStyle,
  setStylesVisible,
}) => {
  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    style: MapStyleItem
  ) => {
    e.preventDefault();
    setMapStyle(style);
    setStylesVisible(false);
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between flex-wrap mx-5">
        {styles.map((style, index) => (
          <a
            href="#"
            key={index}
            className="d-block text-decoration-none mt-1"
            onClick={(e) => handleClick(e, style)}
            style={{ minWidth: 80 }}
          >
            <div
              style={{
                borderWidth: 4,
                borderColor:
                  mapStyle?.name === style.name ? "#bab8b8" : "#fff",
                borderStyle: "solid",
                width: 70,
                height: 70,
              }}
              className="rounded mx-auto"
            >
              <img
                src={style.imageSrc}
                alt={`${style.name} style preview`}
                className="rounded object-fit-cover"
                style={{ width: "100%", height: "100%" }}
              />
            </div>
            <div className="text-muted text-center text-sm mt-1">
              {style.name}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default MapStyles;
