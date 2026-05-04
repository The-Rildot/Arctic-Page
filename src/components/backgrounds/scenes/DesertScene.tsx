import { sceneNight } from "./sceneNight";

type DesertSceneProps = {
  isNightMode: boolean;
};

export function DesertScene({ isNightMode }: DesertSceneProps) {
  return (
    <>
      <div className={sceneNight("desert-dune desert-dune--back", isNightMode)} />
      <div className={sceneNight("desert-dune desert-dune--mid", isNightMode)} />
      <div className={sceneNight("desert-dune desert-dune--front", isNightMode)} />
      <div className={sceneNight("desert-celestial", isNightMode)} />
      <div className="desert-silhouette desert-saguaro desert-saguaro--left" />
      <div className="desert-silhouette desert-saguaro desert-saguaro--right" />
      <div className={sceneNight("desert-ground", isNightMode)} />
    </>
  );
}
