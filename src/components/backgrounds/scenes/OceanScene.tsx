import { sceneNight } from "./sceneNight";

type OceanSceneProps = {
  isNightMode: boolean;
};

export function OceanScene({ isNightMode }: OceanSceneProps) {
  return (
    <>
      <div className="ocean-cloud ocean-cloud--a" />
      <div className="ocean-cloud ocean-cloud--b" />
      <div className={sceneNight("ocean-celestial", isNightMode)} />
      <div className={sceneNight("ocean-horizon-glow", isNightMode)} />
      <div className={sceneNight("ocean-water", isNightMode)}>
        <div className="ocean-wave ocean-wave--1" />
        <div className="ocean-wave ocean-wave--2" />
      </div>
      <div className={sceneNight("ocean-foam", isNightMode)} />
    </>
  );
}
