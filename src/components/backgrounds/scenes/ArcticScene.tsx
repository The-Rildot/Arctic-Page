import { sceneNight } from "./sceneNight";

type ArcticSceneProps = {
  isNightMode: boolean;
};

export function ArcticScene({ isNightMode }: ArcticSceneProps) {
  return (
    <>
      <div className={sceneNight("arctic-peaks arctic-peaks--distant", isNightMode)}>
        <div className="arctic-peak arctic-peak--a" />
        <div className="arctic-peak arctic-peak--b" />
        <div className="arctic-peak arctic-peak--c" />
        <div className="arctic-peak arctic-peak--d" />
        <div className="arctic-peak arctic-peak--e" />
        <div className="arctic-peak arctic-peak--f" />
      </div>
      <div className={sceneNight("arctic-mountain-range arctic-mountain-range--massif", isNightMode)}>
        <div className={sceneNight("arctic-mt arctic-mt--1", isNightMode)} />
        <div className={sceneNight("arctic-mt arctic-mt--2", isNightMode)} />
        <div className={sceneNight("arctic-mt arctic-mt--3", isNightMode)} />
      </div>
      <div className={sceneNight("arctic-mountain-main arctic-mountain-main--left", isNightMode)} />
      <div className={sceneNight("arctic-mountain-main arctic-mountain-main--right", isNightMode)} />
      <div className={sceneNight("arctic-celestial", isNightMode)} />
      <div className={sceneNight("arctic-ground", isNightMode)} />
      <div className="arctic-igloo">
        <img src="/assets/igloo.png" alt="" draggable={false} />
      </div>
    </>
  );
}
