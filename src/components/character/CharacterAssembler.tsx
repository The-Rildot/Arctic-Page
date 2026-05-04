import type { CharacterComponents } from "../../types/characters";
import {
  messageVariantClassSuffix,
  resolveArms,
  resolveBlush,
  resolveBody,
  resolveEyes,
  resolveHead,
  resolveLegs,
  resolveMouth,
  resolveShirt
} from "./partRegistry";

type CharacterAssemblerProps = {
  components: CharacterComponents;
  messageText: string;
  shirtEmoji: string;
};

export function CharacterAssembler({ components, messageText, shirtEmoji }: CharacterAssemblerProps) {
  const Head = resolveHead(components.head.variantId);
  const Eyes = resolveEyes(components.eyes.variantId);
  const Blush = resolveBlush(components.blush.variantId);
  const Mouth = resolveMouth(components.mouthNose.variantId);
  const Body = resolveBody(components.body.variantId);
  const Arms = resolveArms(components.arms.variantId);
  const Legs = resolveLegs(components.legs.variantId);
  const Shirt = resolveShirt(components.shirt.variantId);
  const messageSuffix = messageVariantClassSuffix(components.message.variantId);

  return (
    <>
      <Head>
        <Eyes />
        <Blush />
        <Mouth />
      </Head>
      <Shirt messageText={messageText} emoji={shirtEmoji} messageClassSuffix={messageSuffix} />
      <Body>
        <Arms />
        <Legs />
      </Body>
    </>
  );
}
