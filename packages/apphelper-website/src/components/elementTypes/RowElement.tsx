import React from "react";
import { ElementInterface, SectionInterface } from "../../helpers";
import { Grid } from "@mui/material";
import { DroppableArea } from "../admin/DroppableArea";
import { Element } from "../Element";
import { ApiHelper } from "@churchapps/apphelper";
import type { ChurchInterface } from "@churchapps/helpers";

interface Props { element: ElementInterface, churchSettings: any, textColor: string, onEdit?: (section: SectionInterface | null, element: ElementInterface) => void, onMove?: () => void, church?: ChurchInterface }

export function RowElement(props: Props) {

  const handleDrop = (data: any, sort: number, column: ElementInterface) => {
    if (data.data) {
      const element: ElementInterface = data.data;
      element.sort = sort;
      element.parentId = column.id;
      ApiHelper.post("/elements", [element], "ContentApi").then(() => { if (props.onMove) props.onMove() });
    } else {
      const element: ElementInterface = { sectionId: props.element.sectionId, elementType: data.elementType, sort, parentId: column.id, blockId: props.element.blockId }
      if (props.onEdit) props.onEdit(null, element);
    }
  }

  const getAddElement = (column: ElementInterface, s: number) => {
    const sort = s;
    return (<DroppableArea key={"add" + column.id} accept={["element", "elementBlock"]} text="Drop here to add to row" onDrop={(data) => handleDrop(data, sort, column)} dndDeps={column} />);
  }

  const getElements = (column: ElementInterface, elements: ElementInterface[]) => {
    const result: React.ReactElement[] = []
    if (props.onEdit) result.push(getAddElement(column, 1))
    elements?.forEach(c => {
      result.push(<Element key={c.id} element={c} onEdit={props.onEdit} churchSettings={props.churchSettings} textColor={props.textColor} parentId={column.id} onMove={props.onMove} church={props?.church} />)
    });
    return result;
  }

  const getClassName = () => {
    if (props.onEdit) return "columnWrapper";
    else return "";
  }

  const getMobileOrder = (c:ElementInterface, idx:number) => {
    if (c.answers?.mobileOrder) return {xs: c.answers?.mobileOrder, md: idx};
  }

  const getColumns = () => {
    const emptyStyle = { minHeight: 100, border: "1px solid #999" }
    const result: React.ReactElement[] = []
    props.element.elements?.forEach((c:ElementInterface, idx:number) => {
      let xs = 12;
      if (c.answers?.mobileSize) xs = c.answers?.mobileSize;

      result.push(<Grid key={c.id} size={{ md: c.answers.size, xs: xs }} order={getMobileOrder(c,idx)} className={getClassName()} style={((c.elements && c.elements.length > 0) || !props.onEdit ? {} : emptyStyle)}>
        <div style={{ minHeight: "inherit" }}>
          {c.elements && getElements(c, c.elements)}
        </div>
      </Grid>);
    });
    return result;
  }

  let result = (
    <div id={"el-" + props.element.id}>
      <Grid container columnSpacing={3}>
        {getColumns()}
      </Grid>
    </div>
  );

  return result;
}
