import { PointerEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BASE_CHARACTER_DEFAULTS,
  WANDER_INTERVAL_MS,
  WANDER_MOVE_CHANCE,
  clampAllCharacterPositions,
  clampPositionToViewport,
  getPlaygroundCharacterSize,
  getWanderDeltaX,
  getWanderDeltaY
} from "../constants/motion";
import type { CharacterPosition } from "../types/characters";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

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
  lockedCharacterIds: string[];
};

export function useCharacterMotion({
  customCharacterIds,
  initialPositions,
  lockedCharacterIds
}: UseCharacterMotionArgs) {
  const reduceMotion = usePrefersReducedMotion();

  const draggableCharacterIds = useMemo(
    () => ["penguin", "bear", ...customCharacterIds],
    [customCharacterIds]
  );

  const lockedIdSet = useMemo(() => new Set(lockedCharacterIds), [lockedCharacterIds]);

  const [characterPositions, setCharacterPositions] = useState<Record<string, CharacterPosition>>(() =>
    clampAllCharacterPositions(
      { ...BASE_CHARACTER_DEFAULTS, ...initialPositions },
      ["penguin", "bear", ...customCharacterIds],
      customCharacterIds
    )
  );
  const [draggingCharacterId, setDraggingCharacterId] = useState<string | null>(null);

  const dragStateRef = useRef<DragState | null>(null);
  const suppressSelectRef = useRef<string | null>(null);

  useEffect(() => {
    let raf = 0;
    const onResize = () => {
      if (raf !== 0) {
        cancelAnimationFrame(raf);
      }
      raf = requestAnimationFrame(() => {
        raf = 0;
        setCharacterPositions((prev) =>
          clampAllCharacterPositions(prev, draggableCharacterIds, customCharacterIds)
        );
      });
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (raf !== 0) {
        cancelAnimationFrame(raf);
      }
    };
  }, [customCharacterIds, draggableCharacterIds]);

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    const wanderInterval = window.setInterval(() => {
      setCharacterPositions((prev) => {
        const next = { ...prev };

        draggableCharacterIds.forEach((id) => {
          if (
            dragStateRef.current?.id === id ||
            lockedIdSet.has(id) ||
            Math.random() > WANDER_MOVE_CHANCE
          ) {
            return;
          }

          const isCustomCharacter = customCharacterIds.includes(id);
          const size = getPlaygroundCharacterSize();
          const current =
            next[id] ??
            (isCustomCharacter ? { x: 200, y: 220 } : (BASE_CHARACTER_DEFAULTS[id] ?? { x: 200, y: 220 }));
          const wx = getWanderDeltaX();
          const wy = getWanderDeltaY();
          const deltaX = Math.floor(Math.random() * (wx * 2 + 1)) - wx;
          const deltaY = Math.floor(Math.random() * (wy * 2 + 1)) - wy;
          next[id] = clampPositionToViewport(
            {
              x: current.x + deltaX,
              y: current.y + deltaY
            },
            size
          );
        });

        return next;
      });
    }, WANDER_INTERVAL_MS);

    return () => {
      window.clearInterval(wanderInterval);
    };
  }, [customCharacterIds, draggableCharacterIds, lockedIdSet, reduceMotion]);

  const nudgeCharacter = useCallback(
    (id: string, deltaX: number, deltaY: number) => {
      setCharacterPositions((prev) => {
        const isCustomCharacter = customCharacterIds.includes(id);
        const size = getPlaygroundCharacterSize();
        const current =
          prev[id] ??
          (isCustomCharacter ? { x: 200, y: 220 } : (BASE_CHARACTER_DEFAULTS[id] ?? { x: 200, y: 220 }));
        return {
          ...prev,
          [id]: clampPositionToViewport({ x: current.x + deltaX, y: current.y + deltaY }, size)
        };
      });
    },
    [customCharacterIds]
  );

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

      const nextPosition = clampPositionToViewport(
        {
          x: event.clientX - dragState.pointerOffsetX,
          y: event.clientY - dragState.pointerOffsetY
        },
        { width: dragState.width, height: dragState.height }
      );

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
    nudgeCharacter,
    suppressSelectRef
  };
}
