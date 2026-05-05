import type { SceneId } from "../../constants/scenes";
import { ArcticScene } from "./scenes/ArcticScene.tsx";
import { CityScene } from "./scenes/CityScene.tsx";
import { DesertScene } from "./scenes/DesertScene.tsx";
import { ForestScene } from "./scenes/ForestScene.tsx";
import { OceanScene } from "./scenes/OceanScene.tsx";
import { SpaceScene } from "./scenes/SpaceScene.tsx";

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
      {sceneId === "space" ? <SpaceScene isNightMode={isNightMode} /> : null}
    </div>
  );
}
