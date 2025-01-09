import {marked} from "marked";

interface Props {
  value: string;
  textAlign?: "left" | "center" | "right"
}

export function MarkdownPreviewLight({ value: markdownString = "", textAlign }: Props) {

  const getTargetAndClasses = (extra: string) => {
    let result = "";
    const classRegex = /\.[^( |\})]+/g;
    const matches = extra.match(classRegex)
    if (matches && matches.length > 0) {
      let classes = matches.join(" ");
      classes = classes.replaceAll(".", "");
      result = " class=\"" + classes + "\"";
    }
    const targetRegex = /:target="([^"]+)"/g;
    let targets = targetRegex.exec(extra);
    if (targets) result += " " + targets[0].replace(":", "");
    return result;
  }

  // \[([^\]]+)\] - text
  // \(([^)]+)\) - url
  // \{([^\}]+)\} - target and classes
  // \[([^\]]+)\]\(([^)]+)\)\{([^\}]+)\} - full
  const getSpecialLinks = (markdownString: string) => {
    if (!markdownString) return "";
    const regex = /\[([^\]]+)\]\(([^)]+)\)\{([^\}]+)\}/g;
    const convertedText = markdownString.replace(regex, (match, text, url, extra) => {
      if (!match) return text;
      let result = "<a href=\"" + url + "\"";
      result += getTargetAndClasses(extra);
      result += ">" + text + "</a>";
      return result;
    });
    return convertedText
  }

  if (markdownString === null || markdownString === undefined || !markdownString) return <></>;
  else {
    const convertedText = getSpecialLinks(markdownString || "");
    const html = marked.parse(convertedText || "")
    const style = (textAlign) ? {textAlign} : {}
    return <div style={style} dangerouslySetInnerHTML={{__html: html as string}}></div>
  }
}
