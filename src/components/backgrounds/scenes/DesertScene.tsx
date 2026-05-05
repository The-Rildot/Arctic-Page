import { sceneNight } from "./sceneNight";

type DesertSceneProps = {
  isNightMode: boolean;
};

export function DesertScene({ isNightMode }: DesertSceneProps) {
  return (
    <>
      <div className={sceneNight("desert-dune desert-dune--back", isNightMode)} />
      <div className="desert-pyramid-wrap">
        <img className="desert-pyramid" src="/assets/pyramid.png" alt="" draggable={false} />
      </div>
      <div className={sceneNight("desert-dune desert-dune--mid", isNightMode)} />
      <div className={sceneNight("desert-dune desert-dune--front", isNightMode)} />
      <div className={sceneNight("desert-celestial", isNightMode)} />
      <div className="desert-silhouette desert-saguaro desert-saguaro--left" />
      <div className="desert-silhouette desert-saguaro desert-saguaro--center" />
      <div className="desert-silhouette desert-saguaro desert-saguaro--right" />
      <div className="desert-barrel-wrap desert-barrel-wrap--a">
        <div className="desert-barrel-cactus" />
      </div>
      <div className="desert-barrel-wrap desert-barrel-wrap--b">
        <div className="desert-barrel-cactus desert-barrel-cactus--small" />
      </div>
      <div className={sceneNight("desert-ground", isNightMode)} />
    </>
  );
}
