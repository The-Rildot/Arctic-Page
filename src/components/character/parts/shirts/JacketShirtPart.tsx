type JacketShirtPartProps = {
  messageText: string;
  emoji: string;
  messageClassSuffix: string;
};

export function JacketShirtPart({ messageText, emoji, messageClassSuffix }: JacketShirtPartProps) {
  return (
    <div className="part-shirt part-shirt--jacket">
      <div>{emoji}</div>
      <p className={`part-message part-message--${messageClassSuffix}`}>{messageText}</p>
    </div>
  );
}
