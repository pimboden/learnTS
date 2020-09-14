import { Project, ProjectStatus } from "../models/project.js";

//Project state management
type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];
  public addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

export class ProjectState extends State<Project> {
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
export const projectState = ProjectState.getInstance();
