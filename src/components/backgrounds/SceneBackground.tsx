import type { SceneId } from "../../constants/scenes";
import { ArcticScene } from "./scenes/ArcticScene";
import { CityScene } from "./scenes/CityScene";
import { DesertScene } from "./scenes/DesertScene";
import { ForestScene } from "./scenes/ForestScene";
import { OceanScene } from "./scenes/OceanScene";

type SceneBackgroundProps = {
  sceneId: SceneId;
  isNightMode: boolean;
};

export function SceneBackground({ sceneId, isNightMode }: SceneBackgroundProps) {
  return (
    <div className={`scene-background scene-${sceneId}`} aria-hidden="true">
      {sceneId === "arctic" ? <ArcticScene isNightMode={isNightMode} /> : null}
      {sceneId === "desert" ? <DesertScene isNightMode={isNightMode} /> : null}
      {sceneId === "ocean" ? <OceanScene isNightMode={isNightMode} /> : null}
      {sceneId === "city" ? <CityScene isNightMode={isNightMode} /> : null}
      {sceneId === "forest" ? <ForestScene isNightMode={isNightMode} /> : null}
    </div>
  );
}
