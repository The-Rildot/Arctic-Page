import { sceneNight } from "./sceneNight";

type OceanSceneProps = {
  isNightMode: boolean;
};

export function OceanScene({ isNightMode }: OceanSceneProps) {
  return (
    <>
      <div className="ocean-cloud ocean-cloud--a" />
      <div className="ocean-cloud ocean-cloud--b" />
      <div className={sceneNight("ocean-celestial", isNightMode)} />
      <div className={sceneNight("ocean-horizon-glow", isNightMode)} />
      <div className={sceneNight("ocean-water", isNightMode)}>
        <div className="ocean-reef">
          <div className={sceneNight("reef-mound reef-mound--1", isNightMode)} />
          <div className={sceneNight("reef-mound reef-mound--2", isNightMode)} />
          <div className={sceneNight("reef-mound reef-mound--3", isNightMode)} />
          <div className={sceneNight("reef-coral reef-coral--fan", isNightMode)} />
          <div className={sceneNight("reef-coral reef-coral--fan reef-coral--fan2", isNightMode)} />
          <div className={sceneNight("reef-sponge reef-sponge--1", isNightMode)} />
        </div>
        <div className="ocean-fish ocean-fish--1" />
        <div className="ocean-fish ocean-fish--2" />
        <div className="ocean-fish ocean-fish--3" />
        <div className="ocean-fish ocean-fish--4" />
        <div className="ocean-wave ocean-wave--1" />
        <div className="ocean-wave ocean-wave--2" />
      </div>
      <div className={sceneNight("ocean-foam", isNightMode)} />
    </>
  );
}
