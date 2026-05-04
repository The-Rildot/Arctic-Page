type BearShirtPartProps = {
  messageText: string;
  emoji: string;
  messageClassSuffix: string;
};

export function BearShirtPart({ messageText, emoji, messageClassSuffix }: BearShirtPartProps) {
  return (
    <div className="bear_shirt">
      <div>{emoji}</div>
      <p className={`part-message part-message--${messageClassSuffix}`}>{messageText}</p>
    </div>
  );
}
