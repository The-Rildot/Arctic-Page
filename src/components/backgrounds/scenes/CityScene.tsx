import { sceneNight } from "./sceneNight";

const BUILDING_HEIGHTS_PCT = [32, 48, 38, 62, 44, 72, 55, 40, 58, 36, 68, 42];

type CitySceneProps = {
  isNightMode: boolean;
};

export function CityScene({ isNightMode }: CitySceneProps) {
  return (
    <>
      <div className={sceneNight("city-celestial", isNightMode)} />
      <div className={sceneNight("city-haze", isNightMode)} />
      <div className={sceneNight("city-skyline", isNightMode)}>
        {BUILDING_HEIGHTS_PCT.map((heightPct, index) => (
          <div key={index} className="city-building" style={{ height: `${heightPct}%` }} />
        ))}
      </div>
      <div className={sceneNight("city-ground", isNightMode)} />
    </>
  );
}
