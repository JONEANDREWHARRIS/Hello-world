import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { staggerText } from "../utils/animations";

interface StaggeredTextProps {
  text: string;
  delay?: number;
  staggerDelay?: number;
  fontSize?: number;
  fontWeight?: number | string;
  color?: string;
  letterSpacing?: number;
  style?: React.CSSProperties;
}

/**
 * Kinetic typography component - letters stagger in one by one
 */
export const StaggeredText: React.FC<StaggeredTextProps> = ({
  text,
  delay = 0,
  staggerDelay = 2,
  fontSize = 64,
  fontWeight = 900,
  color = "#ffffff",
  letterSpacing = 0,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const letters = text.split("");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      {letters.map((letter, i) => {
        const { opacity, translateY } = staggerText({
          frame,
          fps,
          letterIndex: i,
          totalLetters: letters.length,
          delay,
          staggerDelay,
        });

        return (
          <span
            key={`${i}-${letter}`}
            style={{
              display: "inline-block",
              fontSize,
              fontWeight,
              color,
              opacity,
              transform: `translateY(${translateY}px)`,
              letterSpacing,
              fontFamily:
                "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              whiteSpace: "pre",
            }}
          >
            {letter}
          </span>
        );
      })}
    </div>
  );
};
