import { sceneNight } from "./sceneNight";

type ForestSceneProps = {
  isNightMode: boolean;
};

export function ForestScene({ isNightMode }: ForestSceneProps) {
  return (
    <>
      <div className={sceneNight("forest-hill forest-hill--far", isNightMode)} />
      <div className={sceneNight("forest-celestial", isNightMode)} />
      <div className={sceneNight("forest-hill forest-hill--near", isNightMode)} />
      <div className="forest-trees">
        <div className={sceneNight("forest-tree forest-tree--1", isNightMode)} />
        <div className={sceneNight("forest-tree forest-tree--2", isNightMode)} />
        <div className={sceneNight("forest-tree forest-tree--3", isNightMode)} />
        <div className={sceneNight("forest-tree forest-tree--4", isNightMode)} />
        <div className={sceneNight("forest-tree forest-tree--5", isNightMode)} />
      </div>
      <div className={sceneNight("forest-ground", isNightMode)} />
    </>
  );
}
