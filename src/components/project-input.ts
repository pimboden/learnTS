import { Component } from "./base-component.js";
import * as Validation from "../util/validation.js";
import { autobind } from "../decorators/autobind.js";
import { projectState } from "../state/project-state.js";

//ProjectInput class
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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

    const titleValidatable: Validation.IValidatable = {
      value: enteredTitle,
      required: true,
      minLength: 1,
      maxlength: 10,
    };
    const descriptionValidatable: Validation.IValidatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
      maxlength: 255,
    };
    const peopleValidatable: Validation.IValidatable = {
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 9,
    };
    if (
      !Validation.validate(titleValidatable) ||
      !Validation.validate(descriptionValidatable) ||
      !Validation.validate(peopleValidatable)
    ) {
      alert("Invalid Input");
      return;
    }
    //return the tuple
    return [enteredTitle, enteredDescription, +enteredPeople];
  }
}
