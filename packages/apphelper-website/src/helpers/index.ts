export interface ElementInterface {
  id?: string;
  sectionId?: string;
  parentId?: string;
  blockId?: string;
  elementType?: string;
  sort?: number;
  answers?: any;
  elements?: ElementInterface[];
}

export interface SectionInterface {
  id?: string;
  elements?: ElementInterface[];
  [key: string]: any;
}
