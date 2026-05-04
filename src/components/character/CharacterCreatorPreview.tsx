import type { CharacterComponents } from "../../types/characters";
import { CharacterAssembler } from "./CharacterAssembler";
import { CharacterRoot } from "./CharacterRoot";

type CharacterCreatorPreviewProps = {
  components: CharacterComponents;
  messageText: string;
  shirtEmoji?: string;
};

const PREVIEW_SCALE = 0.72;

export function CharacterCreatorPreview({
  components,
  messageText,
  shirtEmoji = "💬"
}: CharacterCreatorPreviewProps) {
  const displayMessage = messageText.trim() || "Message";

  return (
    <div className="creator-preview rounded-xl border border-slate-200 bg-gradient-to-b from-slate-50 to-sky-50 p-4 shadow-inner">
      <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">Live preview</p>
      <div className="relative mx-auto flex h-[216px] w-full max-w-[280px] items-center justify-center overflow-visible">
        <div
          className="creator-preview__canvas pointer-events-none"
          style={{
            width: 300,
            height: 300,
            transform: `scale(${PREVIEW_SCALE})`,
            transformOrigin: "center center"
          }}
        >
          <CharacterRoot components={components}>
            <CharacterAssembler components={components} messageText={displayMessage} shirtEmoji={shirtEmoji} />
          </CharacterRoot>
        </div>
      </div>
    </div>
  );
}
