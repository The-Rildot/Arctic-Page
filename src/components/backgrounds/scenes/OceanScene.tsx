import "./ocean.scene.css";
import { sceneNight } from "./sceneNight";

type OceanSceneProps = {
  isNightMode: boolean;
};

export function OceanScene({ isNightMode }: OceanSceneProps) {
  return (
    <>
      <div className={sceneNight("ocean-celestial", isNightMode)} />
      <div className={sceneNight("ocean-horizon-glow", isNightMode)} />
      <div className={sceneNight("ocean-water", isNightMode)}>
        <div className={sceneNight("ocean-reef", isNightMode)}>
          <img
            className="ocean-reef-img ocean-coral ocean-coral--left"
            src="/assets/colorful-coral-reef.png"
            alt=""
            width={520}
            height={400}
            decoding="async"
            draggable={false}
          />
          <img
            className="ocean-reef-img ocean-coral ocean-coral--center"
            src="/assets/vibrant-coral-reef.png"
            alt=""
            width={520}
            height={400}
            decoding="async"
            draggable={false}
          />
          <img
            className="ocean-reef-img ocean-coral ocean-coral--right"
            src="/assets/pink-coral.png"
            alt=""
            width={420}
            height={360}
            decoding="async"
            draggable={false}
          />
          <img
            className="ocean-seaweed ocean-seaweed--1"
            src="/assets/seaweed.png"
            alt=""
            width={160}
            height={280}
            decoding="async"
            draggable={false}
          />
          <img
            className="ocean-seaweed ocean-seaweed--2"
            src="/assets/seaweed.png"
            alt=""
            width={160}
            height={280}
            decoding="async"
            draggable={false}
          />
          <img
            className="ocean-seaweed ocean-seaweed--3"
            src="/assets/seaweed.png"
            alt=""
            width={160}
            height={280}
            decoding="async"
            draggable={false}
          />
        </div>
        <div className="ocean-fish-wrap ocean-fish-wrap--1">
          <img
            className="ocean-fish-img"
            src="/assets/yellow-fish.png"
            alt=""
            width={128}
            height={96}
            decoding="async"
            draggable={false}
          />
        </div>
        <div className="ocean-fish-wrap ocean-fish-wrap--2">
          <img
            className="ocean-fish-img"
            src="/assets/pink-fish.png"
            alt=""
            width={128}
            height={96}
            decoding="async"
            draggable={false}
          />
        </div>
        <div className="ocean-fish-wrap ocean-fish-wrap--3">
          <img
            className="ocean-fish-img"
            src="/assets/red-fish.png"
            alt=""
            width={128}
            height={96}
            decoding="async"
            draggable={false}
          />
        </div>
        <div className="ocean-fish-wrap ocean-fish-wrap--4">
          <img
            className="ocean-fish-img"
            src="/assets/pink-fish.png"
            alt=""
            width={128}
            height={96}
            decoding="async"
            draggable={false}
          />
        </div>
        <div className="ocean-wave ocean-wave--1" />
        <div className="ocean-wave ocean-wave--2" />
      </div>
      <div className={sceneNight("ocean-foam", isNightMode)} />
    </>
  );
}
