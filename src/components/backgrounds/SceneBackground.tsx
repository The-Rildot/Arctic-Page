type SceneBackgroundProps = {
  isNightMode: boolean;
};

const withDarkMode = (className: string, isNightMode: boolean) =>
  isNightMode ? `${className} dark-mode` : className;

export function SceneBackground({ isNightMode }: SceneBackgroundProps) {
  return (
    <div className="scene-background">
      <div className={withDarkMode("left-mountain", isNightMode)}></div>
      <div className={withDarkMode("back-mountain", isNightMode)}></div>
      <div className={withDarkMode("sun", isNightMode)}></div>
      <div className="igloo">
        <img src="https://www.pngall.com/wp-content/uploads/4/Igloo-PNG-Image-HD.png" />
      </div>
      <div className={withDarkMode("ground", isNightMode)}></div>
    </div>
  );
}
