import type { ComponentType, ReactNode } from "react";
import { BearBlushPart } from "./parts/blush/BearBlushPart";
import { FrecklesBlushPart } from "./parts/blush/FrecklesBlushPart";
import { PenguinBlushPart } from "./parts/blush/PenguinBlushPart";
import { SunsetBlushPart } from "./parts/blush/SunsetBlushPart";
import { BearBodyFrame } from "./parts/bodies/BearBodyFrame";
import { PenguinBodyFrame } from "./parts/bodies/PenguinBodyFrame";
import { RobotBodyFrame } from "./parts/bodies/RobotBodyFrame";
import { SealBodyFrame } from "./parts/bodies/SealBodyFrame";
import { BearEyesPart } from "./parts/eyes/BearEyesPart";
import { PenguinEyesPart } from "./parts/eyes/PenguinEyesPart";
import { SleepyEyesPart } from "./parts/eyes/SleepyEyesPart";
import { WideEyesPart } from "./parts/eyes/WideEyesPart";
import { BearHeadFrame } from "./parts/heads/BearHeadFrame";
import { OwlHeadFrame } from "./parts/heads/OwlHeadFrame";
import { PenguinHeadFrame } from "./parts/heads/PenguinHeadFrame";
import { SealHeadFrame } from "./parts/heads/SealHeadFrame";
import { BearArmsPart } from "./parts/arms/BearArmsPart";
import { PenguinArmsPart } from "./parts/arms/PenguinArmsPart";
import { RobotArmsPart } from "./parts/arms/RobotArmsPart";
import { SealFinsPart } from "./parts/arms/SealFinsPart";
import { BearLegsPart } from "./parts/legs/BearLegsPart";
import { PenguinLegsPart } from "./parts/legs/PenguinLegsPart";
import { RobotLegsPart } from "./parts/legs/RobotLegsPart";
import { SealTailPart } from "./parts/legs/SealTailPart";
import { BearNosePart } from "./parts/mouths/BearNosePart";
import { PenguinBeakPart } from "./parts/mouths/PenguinBeakPart";
import { RobotMouthPart } from "./parts/mouths/RobotMouthPart";
import { SealSnoutPart } from "./parts/mouths/SealSnoutPart";
import { BearShirtPart } from "./parts/shirts/BearShirtPart";
import { HoodieShirtPart } from "./parts/shirts/HoodieShirtPart";
import { JacketShirtPart } from "./parts/shirts/JacketShirtPart";
import { PenguinShirtPart } from "./parts/shirts/PenguinShirtPart";

const headMap: Record<string, ComponentType<{ children?: ReactNode }>> = {
  "penguin-head": PenguinHeadFrame,
  "polar-bear-head": BearHeadFrame,
  "seal-head": SealHeadFrame,
  "owl-head": OwlHeadFrame
};

const eyesMap: Record<string, ComponentType> = {
  "penguin-eyes": PenguinEyesPart,
  "polar-bear-eyes": BearEyesPart,
  "sleepy-eyes": SleepyEyesPart,
  "wide-eyes": WideEyesPart
};

const blushMap: Record<string, ComponentType> = {
  "penguin-blush": PenguinBlushPart,
  "polar-bear-blush": BearBlushPart,
  "sunset-blush": SunsetBlushPart,
  freckles: FrecklesBlushPart
};

const mouthMap: Record<string, ComponentType> = {
  "penguin-beak": PenguinBeakPart,
  "polar-bear-nose": BearNosePart,
  "seal-snout": SealSnoutPart,
  "robot-mouth": RobotMouthPart
};

const bodyMap: Record<string, ComponentType<{ children?: ReactNode }>> = {
  "penguin-body": PenguinBodyFrame,
  "polar-bear-body": BearBodyFrame,
  "seal-body": SealBodyFrame,
  "robot-body": RobotBodyFrame
};

const armsMap: Record<string, ComponentType> = {
  "penguin-arms": PenguinArmsPart,
  "polar-bear-arms": BearArmsPart,
  "seal-fins": SealFinsPart,
  "robot-arms": RobotArmsPart
};

const legsMap: Record<string, ComponentType> = {
  "penguin-legs": PenguinLegsPart,
  "polar-bear-legs": BearLegsPart,
  "seal-tail": SealTailPart,
  "robot-legs": RobotLegsPart
};

type ShirtPartProps = { messageText: string; emoji: string; messageClassSuffix: string };

const shirtMap: Record<string, ComponentType<ShirtPartProps>> = {
  "penguin-shirt": PenguinShirtPart,
  "polar-bear-shirt": BearShirtPart,
  "hoodie-shirt": HoodieShirtPart,
  "jacket-shirt": JacketShirtPart
};

export function resolveHead(variantId: string) {
  return headMap[variantId] ?? PenguinHeadFrame;
}

export function resolveEyes(variantId: string) {
  return eyesMap[variantId] ?? PenguinEyesPart;
}

export function resolveBlush(variantId: string) {
  return blushMap[variantId] ?? PenguinBlushPart;
}

export function resolveMouth(variantId: string) {
  return mouthMap[variantId] ?? PenguinBeakPart;
}

export function resolveBody(variantId: string) {
  return bodyMap[variantId] ?? PenguinBodyFrame;
}

export function resolveArms(variantId: string) {
  return armsMap[variantId] ?? PenguinArmsPart;
}

export function resolveLegs(variantId: string) {
  return legsMap[variantId] ?? PenguinLegsPart;
}

export function resolveShirt(variantId: string) {
  return shirtMap[variantId] ?? PenguinShirtPart;
}

export function messageVariantClassSuffix(messageVariantId: string) {
  if (messageVariantId === "bubble-message") {
    return "bubble";
  }
  if (messageVariantId === "badge-message") {
    return "badge";
  }
  return "classic";
}
