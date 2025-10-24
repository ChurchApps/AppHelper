export interface StyleSet {
  all?: any;
  desktop?: any;
  mobile?: any;
}

export interface ElementInterface {
  id?: string;
  sectionId?: string;
  parentId?: string;
  blockId?: string;
  elementType?: string;
  sort?: number;
  answers?: any;
  elements?: ElementInterface[];
  styles?: StyleSet;
}

export interface SectionInterface {
  id?: string;
  elements?: ElementInterface[];
  answers?: any;
  styles?: StyleSet;
  [key: string]: any;
}

export * from "./StyleHelper";
