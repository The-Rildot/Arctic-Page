import "./forest.scene.css";
import { sceneNight } from "./sceneNight";

type ForestSceneProps = {
  isNightMode: boolean;
};

const FRONT_TREE_CLASSES = [
  "forest-tree--1",
  "forest-tree--2",
  "forest-tree--3",
  "forest-tree--4",
  "forest-tree--5",
  "forest-tree--6",
  "forest-tree--7",
  "forest-tree--8",
  "forest-tree--9",
  "forest-tree--10",
  "forest-tree--11",
  "forest-tree--12",
  "forest-tree--13",
  "forest-tree--14"
] as const;

const MID_TREE_CLASSES = [
  "forest-tree-min--a",
  "forest-tree-min--b",
  "forest-tree-min--c",
  "forest-tree-min--d",
  "forest-tree-min--e",
  "forest-tree-min--f",
  "forest-tree-min--g"
] as const;

export function ForestScene({ isNightMode }: ForestSceneProps) {
  return (
    <>
      <div className={sceneNight("forest-hill forest-hill--far", isNightMode)} />
      <div className={sceneNight("forest-celestial", isNightMode)} />
      <div className={sceneNight("forest-hill forest-hill--near", isNightMode)} />
      <div className="forest-trees forest-trees--mid">
        {MID_TREE_CLASSES.map((cls) => (
          <div key={cls} className={sceneNight(`forest-tree-min ${cls}`, isNightMode)} />
        ))}
      </div>
      <div className="forest-trees forest-trees--front">
        {FRONT_TREE_CLASSES.map((cls) => (
          <div key={cls} className={sceneNight(`forest-tree ${cls}`, isNightMode)} />
        ))}
      </div>
      <div className={sceneNight("forest-ground", isNightMode)} />
    </>
  );
}
