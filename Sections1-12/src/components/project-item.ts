import Component  from "./base-component";
import { autobind } from "../decorators/autobind";
import { Project } from "../models/project";
import { IDraggable } from "../models/drag-drop";

//ProjectItem class
export class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements IDraggable {
  private project: Project;

  get persons() {
    return this.project.people === 1
      ? "1 person"
      : `${this.project.people} persons`;
  }
  constructor(hostId: string, project: Project) {
    super("single-project", hostId, false, project.id);
    this.project = project;
    this.configure();
    this.renderContent();
  }

  @autobind
  dragStartHandler(event: DragEvent): void {
    console.log(event);
    event.dataTransfer!.setData("text/plain", this.project.id);
    event.dataTransfer!.effectAllowed = "move";
  }

  @autobind
  dragEndtHandler(_event: DragEvent): void {
    console.log("DragEnd");
  }
  configure() {
    this.element.addEventListener("dragstart", this.dragStartHandler);
    this.element.addEventListener("dragend", this.dragEndtHandler);
  }
  renderContent() {
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector("h3")!.textContent = this.persons + " assigned"; ///Usade of getter
    this.element.querySelector("p")!.textContent = this.project.description;
  }
}
