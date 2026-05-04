type HoodieShirtPartProps = {
  messageText: string;
  emoji: string;
  messageClassSuffix: string;
};

export function HoodieShirtPart({ messageText, emoji, messageClassSuffix }: HoodieShirtPartProps) {
  return (
    <div className="part-shirt part-shirt--hoodie">
      <div>{emoji}</div>
      <p className={`part-message part-message--${messageClassSuffix}`}>{messageText}</p>
    </div>
  );
}
