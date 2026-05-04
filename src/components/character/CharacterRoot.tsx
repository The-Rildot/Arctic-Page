import type { ReactNode } from "react";
import type { CharacterComponents } from "../../types/characters";
import { characterCssVariables } from "../../character/characterVars";

type CharacterRootProps = {
  components: CharacterComponents;
  children: ReactNode;
};

export function CharacterRoot({ components, children }: CharacterRootProps) {
  return (
    <div className="character-root" style={characterCssVariables(components)}>
      {children}
    </div>
  );
}
