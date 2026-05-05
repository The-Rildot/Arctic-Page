import { sceneNight } from "./sceneNight";

const CITY_BACK_HEIGHTS = [28, 34, 26, 38, 30, 32, 27, 35, 29, 31, 28, 33, 26, 30] as const;
const CITY_FRONT_HEIGHTS = [52, 68, 58, 82, 64, 72, 55, 88, 61, 76, 59, 84, 63, 70, 57, 78, 65, 74, 60, 80] as const;
const FLEX_BASIS_BACK = [5, 6.5, 4.5, 7, 5.5, 6, 4.8, 6.8, 5.2, 6.2, 5, 6.5, 4.5, 5.8] as const;
const FLEX_BASIS_FRONT = [4.2, 5.5, 4, 6.2, 4.8, 5.8, 3.8, 6.5, 4.5, 5.5, 4.1, 6, 4.6, 5.2, 4, 6.2, 4.8, 5.5, 4.3, 6] as const;

type CitySceneProps = {
  isNightMode: boolean;
};

export function CityScene({ isNightMode }: CitySceneProps) {
  return (
    <>
      <div className={sceneNight("city-celestial", isNightMode)} />
      <div className={sceneNight("city-haze", isNightMode)} />
      <div className={sceneNight("city-canyon city-canyon--left", isNightMode)} />
      <div className={sceneNight("city-canyon city-canyon--right", isNightMode)} />
      <div className={sceneNight("city-skyline city-skyline--back", isNightMode)}>
        {CITY_BACK_HEIGHTS.map((heightPct, index) => (
          <div
            key={`b-${index}`}
            className={`city-building city-building--back city-building--t${index % 6}`}
            style={{
              height: `${heightPct}%`,
              flex: `0 0 ${FLEX_BASIS_BACK[index % FLEX_BASIS_BACK.length]}%`
            }}
          />
        ))}
      </div>
      <div className={sceneNight("city-skyline city-skyline--front", isNightMode)}>
        {CITY_FRONT_HEIGHTS.map((heightPct, index) => (
          <div
            key={`f-${index}`}
            className={`city-building city-building--front city-building--t${index % 8}`}
            style={{
              height: `${heightPct}%`,
              flex: `0 0 ${FLEX_BASIS_FRONT[index % FLEX_BASIS_FRONT.length]}%`
            }}
          />
        ))}
      </div>
      <div className={sceneNight("city-street-vanish", isNightMode)} />
      <div className={sceneNight("city-street-objects", isNightMode)}>
        <img className="city-street-light city-street-light--left" src="/assets/street-light.png" alt="" draggable={false} />
        <img className="city-street-light city-street-light--mid" src="/assets/street-light.png" alt="" draggable={false} />
        <img className="city-street-light city-street-light--right" src="/assets/street-light.png" alt="" draggable={false} />
        <img className="city-car city-car--1" src="/assets/red-car.png" alt="" draggable={false} />
        <img className="city-car city-car--2" src="/assets/orange-car.png" alt="" draggable={false} />
        <img className="city-car city-car--3" src="/assets/purple-sport-car.png" alt="" draggable={false} />
        <img className="city-car city-car--4" src="/assets/red-sport-car.png" alt="" draggable={false} />
      </div>
      <div className={sceneNight("city-ground", isNightMode)} />
    </>
  );
}
