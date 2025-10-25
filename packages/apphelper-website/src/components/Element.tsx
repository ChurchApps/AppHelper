"use client";

import type { ChurchInterface } from "@churchapps/helpers";
import { ElementInterface, SectionInterface } from "../helpers";
import { DroppableArea } from "./admin/DroppableArea";
import { TextOnly } from "./elementTypes/TextOnly";
import { TextWithPhoto } from "./elementTypes/TextWithPhoto";
import { IframeElement } from "./elementTypes/IframeElement";
import { ButtonLink } from "./elementTypes/ButtonLink";
import { VideoElement } from "./elementTypes/VideoElement";
import { ImageElement } from "./elementTypes/ImageElement";
import { WhiteSpaceElement } from "./elementTypes/WhiteSpaceElement";
import { ApiHelper } from "@churchapps/apphelper";
import { BoxElement } from "./elementTypes/BoxElement";
import { DraggableWrapper } from "./admin/DraggableWrapper";
import { FaqElement } from "./elementTypes/FaqElement";
import { CardElement } from "./elementTypes/CardElement";
import { CarouselElement } from "./elementTypes/CarouselElement";
import { ElementBlock } from "./elementTypes/ElementBlock";
import { LogoElement } from "./elementTypes/LogoElement";
import { MapElement } from "./elementTypes/MapElement";
import { RawHTMLElement } from "./elementTypes/RawHTMLElement";
import { RowElement } from "./elementTypes/RowElement";

interface Props {
  element: ElementInterface;
  church?: ChurchInterface;
  churchSettings: any;
  textColor: string;
  onEdit?: (section: SectionInterface | null, element: ElementInterface) => void;
  onMove?: () => void;
  parentId?: string;
}

export const Element: React.FC<Props> = props => {

  const handleDrop = (data: any, sort: number) => {
    if (data.data) { // Existing element dropped
      const draggedElement: ElementInterface = data.data;
      draggedElement.sort = sort;
      draggedElement.sectionId = props.element.sectionId;
      draggedElement.parentId = props.element.parentId;
      ApiHelper.post("/elements", [draggedElement], "ContentApi").then(() => { if (props.onMove) props.onMove(); });
    }
    else { // New element dropped
      const newElement: ElementInterface = { sectionId: props.element.sectionId, elementType: data.elementType, sort, blockId: props.element.blockId, parentId: props.parentId };
      if (data.blockId) newElement.answersJSON = JSON.stringify({ targetBlockId: data.blockId });
      if (props.onEdit) props.onEdit(null, newElement);
    }
  }

  const getAddElement = (s: number) => {
    const sort = s;
    return (<DroppableArea accept={["element", "elementBlock"]} onDrop={(data) => handleDrop(data, sort)} dndDeps={props.element} />);
  }

  const getAnimationClasses = () => {
    if (props.element.animations?.onShow) return "animated " + props.element.animations.onShow + " " + props.element.animations.onShowSpeed;
  }

  let result = <div style={{ minHeight: 100 }}>Unknown type: {props.element.elementType}</div>

  switch (props.element.elementType) {
    case "text":
      result = <TextOnly key={props.element.id} element={props.element as ElementInterface} onEdit={props.onEdit} />
      break;
    case "textWithPhoto":
      result = <TextWithPhoto key={props.element.id} element={props.element as ElementInterface} onEdit={props.onEdit} />
      break;
    case "box":
      result = <BoxElement key={props.element.id} element={props.element as ElementInterface} onEdit={props.onEdit} churchSettings={props.churchSettings} textColor={props.textColor} onMove={props.onMove} />
      break;
    case "iframe":
      result = <IframeElement key={props.element.id} element={props.element as ElementInterface} />
      break;
    case "buttonLink":
      result = <ButtonLink key={props.element.id} element={props.element as ElementInterface}></ButtonLink>
      break;
    case "video":
      result = <VideoElement key={props.element.id} element={props.element as ElementInterface} />
      break;
    case "image":
      result = <ImageElement key={props.element.id} element={props.element as ElementInterface} />
      break;
    case "whiteSpace":
      result = <WhiteSpaceElement key={props.element.id} element={props.element as ElementInterface} onEdit={props.onEdit} />
      break;
    case "faq":
      result = <FaqElement key={props.element.id} element={props.element as ElementInterface} textColor={props.textColor} />
      break;
    case "card":
      result = <CardElement key={props.element.id} element={props.element as ElementInterface} onEdit={props.onEdit} />
      break;
    case "carousel":
      result = <CarouselElement key={props.element.id} element={props.element as ElementInterface} churchSettings={props.churchSettings} textColor={props.textColor} onEdit={props.onEdit} onMove={props.onMove} />
      break;
    case "block":
      result = <ElementBlock key={props.element.id} element={props.element as ElementInterface} churchSettings={props.churchSettings} textColor={props.textColor} />
      break;
    case "row":
      result = <RowElement key={props.element.id} element={props.element as ElementInterface} churchSettings={props.churchSettings} textColor={props.textColor} onEdit={props.onEdit} onMove={props.onMove} church={props.church} />
      break;
    case "logo":
      result = <LogoElement key={props.element.id} element={props.element as ElementInterface} churchSettings={props.churchSettings} textColor={props.textColor} />
      break;
    case "map":
      result = <MapElement key={props.element.id} element={props.element as ElementInterface} />
      break;
    case "rawHTML":
      result = <RawHTMLElement key={props.element.id} element={props.element as ElementInterface} onEdit={props.onEdit} />
      break;
  }

  /*<DraggableIcon dndType="element" elementType={props.element.elementType} data={props.element} />*/
  if (props.onEdit) {
    result = <>
      <DraggableWrapper dndType="element" elementType={props.element.elementType || ""} data={props.element}>
        <div className={"elementWrapper " + props.element.elementType } onDoubleClick={(e) => { e.stopPropagation(); if (props.onEdit) props.onEdit(null, props.element); }}>
          {result}
        </div>
      </DraggableWrapper>
      {getAddElement((props.element.sort || 0) + 0.1)}
    </>

    /*
    result = <><div className={"elementWrapper " + props.element.elementType }>
      <div className="elementActions">
        <table style={{ float: "right" }}>
          <tbody>
            <tr>
              <td><DraggableIcon dndType="element" elementType={props.element.elementType} data={props.element} /></td>
              <td>
                <div className="elementEditButton">
                  <SmallButton icon="edit" onClick={() => props.onEdit(null, props.element)} toolTip={props.element.elementType} />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {result}
    </div>
    {props.onEdit && getAddElement(props.element.sort + 0.1)}
    </>
    */
  }
  return <div style={{ position: "relative" }} className={getAnimationClasses()}>{result}</div>;
}
