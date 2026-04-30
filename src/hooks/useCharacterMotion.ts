import { PointerEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  BASE_CHARACTER_DEFAULTS,
  CHARACTER_SIZES,
  WANDER_DELTA_X,
  WANDER_DELTA_Y,
  WANDER_INTERVAL_MS,
  WANDER_MOVE_CHANCE,
  clamp
} from "../constants/motion";
import type { CharacterPosition } from "../types/characters";

type DragState = {
  id: string;
  pointerOffsetX: number;
  pointerOffsetY: number;
  width: number;
  height: number;
  startX: number;
  startY: number;
  moved: boolean;
};

type UseCharacterMotionArgs = {
  customCharacterIds: string[];
  initialPositions: Record<string, CharacterPosition>;
};

export function useCharacterMotion({ customCharacterIds, initialPositions }: UseCharacterMotionArgs) {
  const [characterPositions, setCharacterPositions] = useState<Record<string, CharacterPosition>>(() => ({
    ...BASE_CHARACTER_DEFAULTS,
    ...initialPositions
  }));
  const [draggingCharacterId, setDraggingCharacterId] = useState<string | null>(null);

  const dragStateRef = useRef<DragState | null>(null);
  const suppressSelectRef = useRef<string | null>(null);

  const draggableCharacterIds = useMemo(
    () => ["penguin", "bear", ...customCharacterIds],
    [customCharacterIds]
  );

  useEffect(() => {
    const wanderInterval = window.setInterval(() => {
      setCharacterPositions((prev) => {
        const next = { ...prev };

        draggableCharacterIds.forEach((id) => {
          if (dragStateRef.current?.id === id || Math.random() > WANDER_MOVE_CHANCE) {
            return;
          }

          const isCustomCharacter = customCharacterIds.includes(id);
          const size = isCustomCharacter ? CHARACTER_SIZES.custom : CHARACTER_SIZES.base;
          const current = next[id] ?? (isCustomCharacter ? { x: 200, y: 220 } : BASE_CHARACTER_DEFAULTS[id]);
          const deltaX = Math.floor(Math.random() * (WANDER_DELTA_X * 2 + 1)) - WANDER_DELTA_X;
          const deltaY = Math.floor(Math.random() * (WANDER_DELTA_Y * 2 + 1)) - WANDER_DELTA_Y;
          const maxX = Math.max(0, window.innerWidth - size.width);
          const maxY = Math.max(0, window.innerHeight - size.height);

          next[id] = {
            x: clamp(current.x + deltaX, 0, maxX),
            y: clamp(current.y + deltaY, 0, maxY)
          };
        });

        return next;
      });
    }, WANDER_INTERVAL_MS);

    return () => {
      window.clearInterval(wanderInterval);
    };
  }, [customCharacterIds, draggableCharacterIds]);

  const startDrag =
    (id: string, size: { width: number; height: number }, onDragStart?: (id: string) => void) =>
    (event: PointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      const currentPosition = characterPositions[id] ?? BASE_CHARACTER_DEFAULTS[id] ?? { x: 200, y: 220 };
      dragStateRef.current = {
        id,
        pointerOffsetX: event.clientX - currentPosition.x,
        pointerOffsetY: event.clientY - currentPosition.y,
        width: size.width,
        height: size.height,
        startX: event.clientX,
        startY: event.clientY,
        moved: false
      };
      setDraggingCharacterId(id);
      onDragStart?.(id);
    };

  useEffect(() => {
    const handlePointerMove = (event: globalThis.PointerEvent) => {
      const dragState = dragStateRef.current;
      if (!dragState) {
        return;
      }

      if (
        !dragState.moved &&
        (Math.abs(event.clientX - dragState.startX) > 4 || Math.abs(event.clientY - dragState.startY) > 4)
      ) {
        dragState.moved = true;
      }

      const maxX = Math.max(0, window.innerWidth - dragState.width);
      const maxY = Math.max(0, window.innerHeight - dragState.height);
      const nextPosition = {
        x: clamp(event.clientX - dragState.pointerOffsetX, 0, maxX),
        y: clamp(event.clientY - dragState.pointerOffsetY, 0, maxY)
      };

      setCharacterPositions((prev) => ({
        ...prev,
        [dragState.id]: nextPosition
      }));
    };

    const stopDragging = () => {
      if (!dragStateRef.current) {
        return;
      }
      if (dragStateRef.current.moved) {
        suppressSelectRef.current = dragStateRef.current.id;
      }
      dragStateRef.current = null;
      setDraggingCharacterId(null);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopDragging);
    window.addEventListener("pointercancel", stopDragging);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopDragging);
      window.removeEventListener("pointercancel", stopDragging);
    };
  }, []);

  return {
    characterPositions,
    setCharacterPositions,
    draggingCharacterId,
    startDrag,
    suppressSelectRef
  };
}
