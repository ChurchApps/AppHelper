"use client";

import React from "react";
import { Dots } from "react-activity";

// Inline CSS for react-activity to avoid external dependencies
const activityStyles = `
  .activity-loader {
    position: relative;
    display: inline-block;
  }
  .activity-dots {
    position: relative;
    display: inline-block;
  }
  .activity-dots > div {
    position: absolute;
    border-radius: 50%;
    animation: activity-dots 1.2s infinite ease-in-out;
    animation-fill-mode: both;
  }
  .activity-dots > div:nth-child(1) { animation-delay: -1.1s; }
  .activity-dots > div:nth-child(2) { animation-delay: -1.0s; }
  .activity-dots > div:nth-child(3) { animation-delay: -0.9s; }
  .activity-dots > div:nth-child(4) { animation-delay: -0.8s; }
  .activity-dots > div:nth-child(5) { animation-delay: -0.7s; }
  .activity-dots > div:nth-child(6) { animation-delay: -0.6s; }
  .activity-dots > div:nth-child(7) { animation-delay: -0.5s; }
  .activity-dots > div:nth-child(8) { animation-delay: -0.4s; }
  .activity-dots > div:nth-child(9) { animation-delay: -0.3s; }
  .activity-dots > div:nth-child(10) { animation-delay: -0.2s; }
  .activity-dots > div:nth-child(11) { animation-delay: -0.1s; }
  .activity-dots > div:nth-child(12) { animation-delay: 0s; }

  @keyframes activity-dots {
    0%, 80%, 100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }
`;

// Add styles to document head if not already present
if (typeof document !== 'undefined' && !document.getElementById('activity-styles')) {
  const style = document.createElement('style');
  style.id = 'activity-styles';
  style.textContent = activityStyles;
  document.head.appendChild(style);
}

interface Props { size?: "sm" | "md" | "lg", loadingText?: string, color?: string }

export const Loading: React.FC<Props> = (props) => {

  const getContents = () => {
    const text = (props.loadingText) ? props.loadingText : "Loading"
    const color = (props.color) ? props.color : "#222"
    let result = <><Dots speed={0.8} animating={true} size={32} color={color} /><p style={{ color: color }}>{text}</p></>
    switch (props.size) {
      case "sm":
        result = <><Dots speed={0.8} animating={true} size={20} color={color} /><p style={{ fontSize: 12, color: color }}>{text}</p></>
        break;
      case "lg":
        result = <><Dots speed={0.8} animating={true} size={48} color={color} /><p style={{ fontSize: 30, color: color }}>{text}</p></>
        break;
    }
    return result;
  }

  return (
    <div style={{ textAlign: "center", fontFamily: "Roboto" }}>
      {getContents()}
    </div>
  )
}
