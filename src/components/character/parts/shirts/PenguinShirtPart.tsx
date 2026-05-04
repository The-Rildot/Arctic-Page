type PenguinShirtPartProps = {
  messageText: string;
  emoji: string;
  messageClassSuffix: string;
};

export function PenguinShirtPart({ messageText, emoji, messageClassSuffix }: PenguinShirtPartProps) {
  return (
    <div className="shirt">
      <div>{emoji}</div>
      <p className={`part-message part-message--${messageClassSuffix}`}>{messageText}</p>
    </div>
  );
}
