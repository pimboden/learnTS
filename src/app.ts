//Drag & Drop Interfaces

interface IDraggable {
  dragStartHandler(event: DragEvent): void;
  dragEndtHandler(event: DragEvent): void;
}

interface IDragTarget {
  dragOverHadler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
}

// Project
enum ProjectStatus {
  Active,
  Finished,
}
class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}
//Project state management
type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];
  public addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

class ProjectState extends State<Project> {
  //this is a singleton

  private projects: Project[] = [];
  private static instance: ProjectState;
  private constructor() {
    super();
  }
  static getInstance() {
    if (this.instance) {
      return this.instance;
    } else {
      this.instance = new ProjectState();
      return this.instance;
    }
  }

  public addProject(title: string, description: string, numOfPeople: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      numOfPeople,
      ProjectStatus.Active
    );
    this.projects.push(newProject);
    this.triggerListeners();
  }

  public moveProject(projId: string, newStatus: ProjectStatus) {
    const foundProj = this.projects.find((x) => x.id === projId);
    if (foundProj && foundProj.status !== newStatus) {
      foundProj.status = newStatus;
      this.triggerListeners();
    }
  }
  private triggerListeners(): void {
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice()); //this.projects.slice() reurns a copy of the array
    }
  }
}
const projectState = ProjectState.getInstance();

//Validation
interface IValidatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxlength?: number;
  min?: number;
  max?: number;
}

function validate(validatableInput: IValidatable) {
  let isValid = true;
  if (validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length > 0;
  }
  if (
    validatableInput.minLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid && validatableInput.value.length >= validatableInput.minLength;
  }
  if (
    validatableInput.maxlength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid && validatableInput.value.length <= validatableInput.maxlength;
  }
  if (
    validatableInput.min != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value >= validatableInput.min;
  }
  if (
    validatableInput.max != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value <= validatableInput.max;
  }
  return isValid;
}

//Autobind decorator
function autobind(_: any, _1: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjustedDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjustedDescriptor;
}

// Component Base Class

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(
    templateId: string,
    hostElementId: string,
    insertAtStart: boolean,
    newElementId?: string
  ) {
    this.templateElement = document.getElementById(
      templateId
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostElementId)! as T;
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as U;
    if (newElementId) {
      this.element.id = newElementId;
    }
    this.attach(insertAtStart);
  }
  private attach(insertAtStart: boolean) {
    this.hostElement.insertAdjacentElement(
      insertAtStart ? "afterbegin" : "beforeend",
      this.element
    );
  }
  abstract configure(): void;
  abstract renderContent(): void;
}

//ProjectItem class
class ProjectItem
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
//ProjectList class
class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements IDragTarget {
  assignedProjects: Project[];

  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);

    this.assignedProjects = [];
    this.configure();
    this.renderContent();
  }

  @autobind
  dragOverHadler(event: DragEvent): void {
    if (event.dataTransfer && event.dataTransfer.types[0] == "text/plain") {
      event.preventDefault(); //Drop will not fire if this line is not called
      const listEl = this.element.querySelector("ul")!;
      listEl.classList.add("droppable");
    }
  }

  @autobind
  dropHandler(event: DragEvent): void {
    const projId = event.dataTransfer!.getData("text/plain");
    projectState.moveProject(
      projId,
      this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished
    );
    const listEl = this.element.querySelector("ul")!;
    listEl.classList.remove("droppable");
  }

  @autobind
  dragLeaveHandler(event: DragEvent): void {
    console.log("dragLeaveHandler", event);
    const listEl = this.element.querySelector("ul")!;
    listEl.classList.remove("droppable");
  }
  configure() {
    this.element.addEventListener("dragover", this.dragOverHadler);
    this.element.addEventListener("drop", this.dropHandler);
    this.element.addEventListener("dragleave", this.dragLeaveHandler);

    projectState.addListener((projects: Project[]) => {
      this.assignedProjects = projects.filter(
        (prj) =>
          (prj.status === ProjectStatus.Active && this.type === "active") ||
          (prj.status === ProjectStatus.Finished && this.type === "finished")
      );
      this.renderProjects();
    });
  }
  renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS";
  }
  private renderProjects() {
    const listElement = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    listElement.innerHTML = "";
    for (const project of this.assignedProjects) {
      new ProjectItem(this.element.querySelector("ul")!.id, project);
    }
  }
}

//ProjectInput class
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputelement: HTMLInputElement;
  descriptionInputelement: HTMLInputElement;
  peopleInputelement: HTMLInputElement;

  constructor() {
    super("project-input", "app", true, "user-input");
    this.titleInputelement = this.element.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputelement = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputelement = this.element.querySelector(
      "#people"
    ) as HTMLInputElement;
    this.configure();
  }

  configure() {
    //this.element.addEventListener("submit",this.submitHadler.bind(this))
    this.element.addEventListener("submit", this.submitHadler);
  }
  renderContent() {}

  private clearInputs() {
    this.titleInputelement.value = "";
    this.descriptionInputelement.value = "";
    this.peopleInputelement.value = "";
  }

  @autobind
  private submitHadler(event: Event) {
    event.preventDefault();
    const userInput = this.getUserInputData();
    if (Array.isArray(userInput)) {
      //Destructure
      const [title, desc, people] = userInput;
      projectState.addProject(title, desc, people);
      this.clearInputs();
    }
  }

  private getUserInputData(): [string, string, number] | void {
    const enteredTitle = this.titleInputelement.value;
    const enteredDescription = this.descriptionInputelement.value;
    const enteredPeople = this.peopleInputelement.value;

    const titleValidatable: IValidatable = {
      value: enteredTitle,
      required: true,
      minLength: 1,
      maxlength: 10,
    };
    const descriptionValidatable: IValidatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
      maxlength: 255,
    };
    const peopleValidatable: IValidatable = {
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 9,
    };
    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable)
    ) {
      alert("Invalid Input");
      return;
    }
    //return the tuple
    return [enteredTitle, enteredDescription, +enteredPeople];
  }
}

const prjInstance = new ProjectInput();
const activePrjList = new ProjectList("active");
const finishedPrjList = new ProjectList("finished");
