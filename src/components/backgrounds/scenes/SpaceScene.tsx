import { sceneNight } from "./sceneNight";

type SpaceSceneProps = {
  isNightMode: boolean;
};

export function SpaceScene({ isNightMode }: SpaceSceneProps) {
  return (
    <>
      <div className="space-stars" />
      <div className={sceneNight("space-nebula", isNightMode)} />
      <div className={sceneNight("space-planet space-planet--ringed", isNightMode)} />
      <div className={sceneNight("space-planet space-planet--red", isNightMode)} />
      <div className={sceneNight("space-planet space-planet--blue", isNightMode)} />
      <div className={sceneNight("space-planet space-planet--moon", isNightMode)} />
      <div className="space-station-wrap">
        <img
          className="space-station-img"
          src="/assets/spaceStation.png"
          alt=""
          draggable={false}
        />
      </div>
      <div className={sceneNight("space-glow-horizon", isNightMode)} />
    </>
  );
}
