//Drag & Drop Interfaces
export interface IDraggable {
  dragStartHandler(event: DragEvent): void;
  dragEndtHandler(event: DragEvent): void;
}

export interface IDragTarget {
  dragOverHadler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
}
