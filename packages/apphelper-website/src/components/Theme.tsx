import React from "react";
import { AppearanceHelper } from "@churchapps/apphelper";
import type { GlobalStyleInterface } from "../helpers";

interface Props {
  globalStyles?: GlobalStyleInterface;
  appearance?: any;
}

export const Theme: React.FC<Props> = (props) => {
  const lines: string[] = [];

  if (props.globalStyles?.palette) {
    const palette = JSON.parse(props.globalStyles.palette);
    lines.push("--light: " + palette.light + ";");
    lines.push("--lightAccent: " + palette.lightAccent + ";");
    lines.push("--accent: " + palette.accent + ";");
    lines.push("--darkAccent: " + palette.darkAccent + ";");
    lines.push("--dark: " + palette.dark + ";");
  }

  if (props.globalStyles?.fonts) {
    const fonts = JSON.parse(props.globalStyles.fonts);
    lines.push("--headingFont: '" + fonts.heading + "';");
    lines.push("--bodyFont: '" + fonts.body + "';");

    // Dynamically load Google Fonts
    const googleFonts: string[] = [];
    if (fonts.heading !== "Roboto") googleFonts.push(fonts.heading);
    if (fonts.body !== fonts.heading) googleFonts.push(fonts.body);

    React.useEffect(() => {
      if (googleFonts.length > 0) {
        const fontList: string[] = [];
        googleFonts.forEach(f => fontList.push(f.replace(" ", "+") + ":wght@400"));
        const googleFontsUrl = "https://fonts.googleapis.com/css2?family=" + fontList.join("&family=") + "&display=swap";

        const existingLink = document.querySelector(`link[href="${googleFontsUrl}"]`);
        if (!existingLink) {
          const link = document.createElement('link');
          link.href = googleFontsUrl;
          link.rel = 'stylesheet';
          link.type = 'text/css';
          document.head.appendChild(link);
        }
      }
    }, [googleFonts.join(",")]);
  }

  if (props.globalStyles?.customCss) lines.push(props.globalStyles.customCss);

  const css = ":root { " + lines.join("\n") + " }";

  const customJs = props.globalStyles?.customJS ? (
    <div dangerouslySetInnerHTML={{ __html: props.globalStyles.customJS }} />
  ) : null;

  return (
    <>
      <style>{css}</style>
      {customJs}
    </>
  );
};
