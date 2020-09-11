//Project state management

class ProjectState{
  //this is a singleton

  private listeners:any[] = [];

  projects: any[]=[];
  private static instance : ProjectState
  private constructor(){

  }
  static getInstance(){
    if(this.instance){
      return this.instance
    }
    else{
      this.instance = new ProjectState()
      return this.instance
    }
  }
  public addListener(listenerFn:Function){
    this.listeners.push(listenerFn)
  }
  public addProject(title:string, description: string, numOfPeople:number){
    const newProject={
      id: Math.random().toString(),
      title:title,
      description: description,
      people: numOfPeople
    }
    this.projects.push(newProject)
    for(const listenerFn of this.listeners){
      listenerFn(this.projects.slice()) //this.projects.slice() reurns a copy of the array
    }
  }
}
const projectState = ProjectState.getInstance();

//Validation
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxlength?: number;
  min?: number;
  max?: number;
}

function validate(validatableInput: Validatable) {
  debugger
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
//ProjectList class
class ProjectList {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLElement;
  assignedProjects: any[];

  constructor(private type: 'active' | 'finished' ){
    this.templateElement = document.getElementById(
      "project-list"
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;
    this.assignedProjects=[]
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as HTMLElement;
    this.element.id = `${this.type}-projects`

    projectState.addListener((projects: any[])=>{
      this.assignedProjects = projects;
      this.renderProjects();
    })

    this.attach()
    this.renderContent();
  }
  private renderProjects() {
    const listElement =  document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
    for (const project of this.assignedProjects){
      const listItem = document.createElement('li')
      listItem.textContent = project.title;
      listElement.appendChild(listItem)
    }
  }
  private renderContent() {
    const listId = `${this.type}-projects-list`
    this.element.querySelector('ul')!.id = listId
    this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
  }
  private attach() {
    this.hostElement.insertAdjacentElement("beforeend", this.element);
  }
}

//ProjectInput class
class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  titleInputelement: HTMLInputElement;
  descriptionInputelement: HTMLInputElement;
  peopleInputelement: HTMLInputElement;
  constructor() {
    this.templateElement = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = "user-input";
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
    this.attach();
  }

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
      projectState.addProject(title, desc, people)
      this.clearInputs();
    }
  }

  private getUserInputData(): [string, string, number] | void {
    const enteredTitle = this.titleInputelement.value;
    const enteredDescription = this.descriptionInputelement.value;
    const enteredPeople = this.peopleInputelement.value;

    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true,
      minLength: 2,
      maxlength: 10,
    };
    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
      maxlength: 255,
    };
    const peopleValidatable: Validatable = {
      value: +enteredPeople,
      required: true,
      min: 2,
      max: 8,
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

  private configure() {
    //this.element.addEventListener("submit",this.submitHadler.bind(this))
    this.element.addEventListener("submit", this.submitHadler);
  }
  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

const prjInstance = new ProjectInput();
const activePrjList = new ProjectList('active');
const finishedPrjList = new ProjectList('finished');
