"use client";

import { Icon } from "@mui/material";
import React, { CSSProperties, useEffect, useState } from "react";
import { useDrop } from 'react-dnd'

type Props = {
  children?: React.ReactNode,
  accept: any,
  text?: string
  onDrop: (data: any) => void,
  dndDeps?: any,
  updateIsDragging?: (isDragging: boolean) => void
  hideWhenInactive?: boolean
};

export function DroppableArea(props: Props) {
  const { accept, onDrop, text, updateIsDragging, dndDeps, hideWhenInactive = true } = props;
  const [isDragging, setIsDragging] = useState(false);
  const [justDropped, setJustDropped] = useState(false);

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept,
      drop: (data) => {
        onDrop(data);
        setJustDropped(true);
        setTimeout(() => setJustDropped(false), 600);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [dndDeps, onDrop]
  );

  // Update dragging state via effect to avoid state updates during render
  useEffect(() => {
    setIsDragging(canDrop);
  }, [canDrop]);

  useEffect(() => {
    if (updateIsDragging) updateIsDragging(isDragging);
  }, [isDragging, updateIsDragging]);

  // Enhanced droppable zone styling
  const getDroppableStyle = (): CSSProperties => {
    // When nothing is being dragged - completely invisible/minimal (new behavior)
    if (hideWhenInactive && !canDrop) {
      return {
        width: "100%",
        minHeight: "4px",
        padding: "2px",
        border: "none",
        backgroundColor: "transparent",
        borderRadius: "4px",
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      };
    }

    // Legacy behavior (when hideWhenInactive is false) - absolute positioning
    if (!hideWhenInactive && !canDrop) {
      return {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "4px",
        zIndex: 1,
        border: "none",
        backgroundColor: "transparent",
      };
    }

    // When dragging - show full drop zone UI
    const baseStyle: CSSProperties = {
      width: "100%",
      minHeight: "60px",
      padding: "20px 10px",
      margin: "8px 0",
      borderRadius: "8px",
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: hideWhenInactive ? "relative" : "absolute",
      top: hideWhenInactive ? undefined : 0,
      left: hideWhenInactive ? undefined : 0,
      zIndex: hideWhenInactive ? undefined : 1,
      overflow: "hidden",
    };

    if (justDropped) {
      return {
        ...baseStyle,
        border: "2px solid rgba(76, 175, 80, 1)",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        transform: "scale(1)",
        boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)",
      };
    }

    if (isOver) {
      return {
        ...baseStyle,
        border: "2px solid rgba(25, 118, 210, 1)",
        backgroundColor: "rgba(25, 118, 210, 0.15)",
        transform: "scale(1.02)",
        boxShadow: "0 4px 12px rgba(25, 118, 210, 0.25)",
      };
    }

    return {
      ...baseStyle,
      border: "2px dashed rgba(25, 118, 210, 0.4)",
      backgroundColor: "rgba(25, 118, 210, 0.06)",
    };
  };

  // Display text based on state
  const displayText = text || "Drop here to add";

  return (
    <div
      ref={drop as any}
      style={getDroppableStyle()}
      data-testid="droppable-area"
      aria-label={canDrop ? `Drop zone: ${displayText}` : ""}
      role={canDrop ? "region" : undefined}
    >
      {canDrop && (
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          color: "rgba(25, 118, 210, 0.8)",
          fontSize: "0.875rem",
          fontWeight: 500,
        }}>
          <Icon style={{
            fontSize: "1.25rem",
            transition: "transform 0.2s ease",
            transform: isOver ? "scale(1.1)" : "scale(1)",
          }}>
            {isOver ? "add_circle" : "add_circle_outline"}
          </Icon>
          <span>{displayText}</span>
        </div>
      )}
    </div>
  );
}
