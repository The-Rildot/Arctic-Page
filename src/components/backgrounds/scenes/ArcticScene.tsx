import { sceneNight } from "./sceneNight";

type ArcticSceneProps = {
  isNightMode: boolean;
};

export function ArcticScene({ isNightMode }: ArcticSceneProps) {
  return (
    <>
      <div className={sceneNight("arctic-mountain-left", isNightMode)} />
      <div className={sceneNight("arctic-mountain-back", isNightMode)} />
      <div className={sceneNight("arctic-celestial", isNightMode)} />
      <div className="arctic-igloo">
        <img
          src="https://www.pngall.com/wp-content/uploads/4/Igloo-PNG-Image-HD.png"
          alt=""
          draggable={false}
        />
      </div>
      <div className={sceneNight("arctic-ground", isNightMode)} />
    </>
  );
}
