import type { CharacterComponents } from "../../types/characters";
import {
  resolveArms,
  resolveBlush,
  resolveBody,
  resolveEyes,
  resolveHead,
  resolveLegs,
  resolveMouth
} from "./partRegistry";

type CharacterAssemblerProps = {
  components: CharacterComponents;
};

export function CharacterAssembler({ components }: CharacterAssemblerProps) {
  const Head = resolveHead(components.head.variantId);
  const Eyes = resolveEyes(components.eyes.variantId);
  const Blush = resolveBlush(components.blush.variantId);
  const Mouth = resolveMouth(components.mouthNose.variantId);
  const Body = resolveBody(components.body.variantId);
  const Arms = resolveArms(components.arms.variantId);
  const Legs = resolveLegs(components.legs.variantId);

  return (
    <>
      <Head>
        <Eyes />
        <Blush />
        <Mouth />
      </Head>
      <Body>
        <Arms />
        <Legs />
      </Body>
    </>
  );
}
