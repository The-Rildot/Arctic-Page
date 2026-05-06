import type { ComponentType, ReactNode } from "react";
import { ButterflyArmsPart } from "./parts/arms/ButterflyArmsPart";
import { BearBlushPart } from "./parts/blush/BearBlushPart";
import { ButterflyBlushPart } from "./parts/blush/ButterflyBlushPart";
import { FrecklesBlushPart } from "./parts/blush/FrecklesBlushPart";
import { LionBlushPart } from "./parts/blush/LionBlushPart";
import { PenguinBlushPart } from "./parts/blush/PenguinBlushPart";
import { RobotBlushPart } from "./parts/blush/RobotBlushPart";
import { SunsetBlushPart } from "./parts/blush/SunsetBlushPart";
import { BearBodyFrame } from "./parts/bodies/BearBodyFrame";
import { ButterflyBodyFrame } from "./parts/bodies/ButterflyBodyFrame";
import { LionBodyFrame } from "./parts/bodies/LionBodyFrame";
import { PenguinBodyFrame } from "./parts/bodies/PenguinBodyFrame";
import { RobotBodyFrame } from "./parts/bodies/RobotBodyFrame";
import { SealBodyFrame } from "./parts/bodies/SealBodyFrame";
import { BearEyesPart } from "./parts/eyes/BearEyesPart";
import { ButterflyEyesPart } from "./parts/eyes/ButterflyEyesPart";
import { LionEyesPart } from "./parts/eyes/LionEyesPart";
import { PenguinEyesPart } from "./parts/eyes/PenguinEyesPart";
import { RobotEyesPart } from "./parts/eyes/RobotEyesPart";
import { SleepyEyesPart } from "./parts/eyes/SleepyEyesPart";
import { WideEyesPart } from "./parts/eyes/WideEyesPart";
import { BearHeadFrame } from "./parts/heads/BearHeadFrame";
import { ButterflyHeadFrame } from "./parts/heads/ButterflyHeadFrame";
import { LionHeadFrame } from "./parts/heads/LionHeadFrame";
import { OwlHeadFrame } from "./parts/heads/OwlHeadFrame";
import { PenguinHeadFrame } from "./parts/heads/PenguinHeadFrame";
import { RobotHeadFrame } from "./parts/heads/RobotHeadFrame";
import { SealHeadFrame } from "./parts/heads/SealHeadFrame";
import { BearArmsPart } from "./parts/arms/BearArmsPart";
import { LionArmsPart } from "./parts/arms/LionArmsPart";
import { PenguinArmsPart } from "./parts/arms/PenguinArmsPart";
import { RobotArmsPart } from "./parts/arms/RobotArmsPart";
import { SealFinsPart } from "./parts/arms/SealFinsPart";
import { BearLegsPart } from "./parts/legs/BearLegsPart";
import { ButterflyLegsPart } from "./parts/legs/ButterflyLegsPart";
import { LionLegsPart } from "./parts/legs/LionLegsPart";
import { PenguinLegsPart } from "./parts/legs/PenguinLegsPart";
import { RobotLegsPart } from "./parts/legs/RobotLegsPart";
import { SealTailPart } from "./parts/legs/SealTailPart";
import { BearNosePart } from "./parts/mouths/BearNosePart";
import { ButterflyMouthPart } from "./parts/mouths/ButterflyMouthPart";
import { LionMouthPart } from "./parts/mouths/LionMouthPart";
import { PenguinBeakPart } from "./parts/mouths/PenguinBeakPart";
import { RobotMouthPart } from "./parts/mouths/RobotMouthPart";
import { SealSnoutPart } from "./parts/mouths/SealSnoutPart";

const headMap: Record<string, ComponentType<{ children?: ReactNode }>> = {
  "penguin-head": PenguinHeadFrame,
  "polar-bear-head": BearHeadFrame,
  "seal-head": SealHeadFrame,
  "owl-head": OwlHeadFrame,
  "robot-head": RobotHeadFrame,
  "lion-head": LionHeadFrame,
  "butterfly-head": ButterflyHeadFrame
};

const eyesMap: Record<string, ComponentType> = {
  "penguin-eyes": PenguinEyesPart,
  "polar-bear-eyes": BearEyesPart,
  "sleepy-eyes": SleepyEyesPart,
  "wide-eyes": WideEyesPart,
  "robot-eyes": RobotEyesPart,
  "lion-eyes": LionEyesPart,
  "butterfly-eyes": ButterflyEyesPart
};

const blushMap: Record<string, ComponentType> = {
  "penguin-blush": PenguinBlushPart,
  "polar-bear-blush": BearBlushPart,
  "sunset-blush": SunsetBlushPart,
  freckles: FrecklesBlushPart,
  "robot-blush": RobotBlushPart,
  "lion-blush": LionBlushPart,
  "butterfly-blush": ButterflyBlushPart
};

const mouthMap: Record<string, ComponentType> = {
  "penguin-beak": PenguinBeakPart,
  "polar-bear-nose": BearNosePart,
  "seal-snout": SealSnoutPart,
  "robot-mouth": RobotMouthPart,
  "lion-mouth": LionMouthPart,
  "butterfly-mouth": ButterflyMouthPart
};

const bodyMap: Record<string, ComponentType<{ children?: ReactNode }>> = {
  "penguin-body": PenguinBodyFrame,
  "polar-bear-body": BearBodyFrame,
  "seal-body": SealBodyFrame,
  "robot-body": RobotBodyFrame,
  "lion-body": LionBodyFrame,
  "butterfly-body": ButterflyBodyFrame
};

const armsMap: Record<string, ComponentType> = {
  "penguin-arms": PenguinArmsPart,
  "polar-bear-arms": BearArmsPart,
  "seal-fins": SealFinsPart,
  "robot-arms": RobotArmsPart,
  "lion-arms": LionArmsPart,
  "butterfly-arms": ButterflyArmsPart
};

const legsMap: Record<string, ComponentType> = {
  "penguin-legs": PenguinLegsPart,
  "polar-bear-legs": BearLegsPart,
  "seal-tail": SealTailPart,
  "robot-legs": RobotLegsPart,
  "lion-legs": LionLegsPart,
  "butterfly-legs": ButterflyLegsPart
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
