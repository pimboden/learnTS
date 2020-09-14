/// <reference path="base-component.ts"/>

namespace App {
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
}
