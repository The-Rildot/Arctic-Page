import { lazy, Suspense, type ReactNode } from "react";
import type { SceneId } from "../../constants/scenes";

const ArcticScene = lazy(() =>
  import("./scenes/ArcticScene").then((m) => ({ default: m.ArcticScene }))
);
const DesertScene = lazy(() =>
  import("./scenes/DesertScene").then((m) => ({ default: m.DesertScene }))
);
const OceanScene = lazy(() =>
  import("./scenes/OceanScene").then((m) => ({ default: m.OceanScene }))
);
const CityScene = lazy(() =>
  import("./scenes/CityScene").then((m) => ({ default: m.CityScene }))
);
const ForestScene = lazy(() =>
  import("./scenes/ForestScene").then((m) => ({ default: m.ForestScene }))
);
const SpaceScene = lazy(() =>
  import("./scenes/SpaceScene").then((m) => ({ default: m.SpaceScene }))
);

type SceneChunkProps = {
  sceneId: SceneId;
  isNightMode: boolean;
};

function SceneChunk({ sceneId, isNightMode }: SceneChunkProps): ReactNode {
  switch (sceneId) {
    case "arctic":
      return <ArcticScene isNightMode={isNightMode} />;
    case "desert":
      return <DesertScene isNightMode={isNightMode} />;
    case "ocean":
      return <OceanScene isNightMode={isNightMode} />;
    case "city":
      return <CityScene isNightMode={isNightMode} />;
    case "forest":
      return <ForestScene isNightMode={isNightMode} />;
    case "space":
      return <SpaceScene isNightMode={isNightMode} />;
    default: {
      const _exhaustive: never = sceneId;
      return _exhaustive;
    }
  }
}

type SceneBackgroundProps = {
  sceneId: SceneId;
  isNightMode: boolean;
};

export function SceneBackground({ sceneId, isNightMode }: SceneBackgroundProps) {
  return (
    <div className={`scene-background scene-${sceneId}`} aria-hidden="true">
      <Suspense fallback={null}>
        <SceneChunk sceneId={sceneId} isNightMode={isNightMode} />
      </Suspense>
    </div>
  );
}
