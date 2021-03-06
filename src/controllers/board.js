import BoardComponent from '../components/board.js';
import LoadMoreButtonComponent from '../components/load-more-button.js';
import NoTasks from '../components/no-tasks.js';
import SortComponent from '../components/sort.js';
import TasksListComponent from '../components/tasks-list.js';
import TaskController from './task.js';
import {
  render,
  removeElement,
  replaceElement,
} from '../utils/render.js';
import {
  FilterType,
  ModeController,
  SortType,
} from '../const.js';

const EMPTY_TASK = {
  id: String(Date.now() + Math.random() * 10),
  description: ``,
  dueDate: null,
  repeatingDays: {
    "mo": false,
    "tu": false,
    "we": false,
    "th": false,
    "fr": false,
    "sa": false,
    "su": false,
  },
  color: `green`,
  isArchive: false,
  isFavorite: false,
};
const SHOWING_TASKS_COUNT = 8;

class BoardController {
  constructor(container, tasksModel, api) {
    this._api = api;
    this._container = container;
    this._tasksModel = tasksModel;

    this._showedTasksController = [];
    this._showingTasksCount = SHOWING_TASKS_COUNT;
    this._sortType = SortType.DEFAULT;

    this._boardComponent = new BoardComponent();
    this._boardEl = this._boardComponent.getElement();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
    this._noTasksComponent = new NoTasks();
    this._sortComponent = new SortComponent();
    this._tasksListComponent = new TasksListComponent();
    this._tasksListEl = this._tasksListComponent.getElement();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onLoadMoreButton = this._onLoadMoreButton.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._tasksModel.setFilterChangeHandler(this._onFilterChange);
  }

  addNewTask() {
    this._tasksModel.setActiveFilter(FilterType.ALL);
    this._updateTasks();
    const taskController = new TaskController(this._tasksListEl, this._onDataChange, this._onViewChange, ModeController.NEW_TASK);
    this._showedTasksController.unshift(taskController);
    taskController.render(EMPTY_TASK);
  }

  hide() {
    this._boardComponent.hide();
  }

  render() {
    render(this._container, this._boardComponent);

    const tasks = this._tasksModel.getTasks();
    if (tasks.length === 0) {
      render(this._boardEl, this._noTasksComponent);
      return;
    }

    render(this._boardEl, this._sortComponent);
    render(this._boardEl, this._tasksListComponent);

    this._renderTasksList(tasks);
  }

  show() {
    this._boardComponent.show();
  }

  _getSortedTasks() {
    const tasks = this._tasksModel.getTasks();
    let sortedTasks = [];

    switch (this._sortType) {
      case SortType.DATE_UP:
        sortedTasks = tasks.slice().sort((a, b) => a.dueDate - b.dueDate);
        break;
      case SortType.DATE_DOWN:
        sortedTasks = tasks.slice().sort((a, b) => b.dueDate - a.dueDate);
        break;
      case SortType.DEFAULT:
        sortedTasks = tasks;
    }

    return sortedTasks;
  }

  _onDataChange(taskController, oldData, newData) {
    if (newData === null) {
      this._api.deleteTask(oldData.id)
        .then(() => {
          this._tasksModel.removeTask(oldData.id);
          const tasks = this._getSortedTasks();
          this._renderTasksList(tasks);
        })
        .catch(() => {
          taskController.shake();
        });
      return;
    }

    if (oldData === EMPTY_TASK) {
      this._api.createTask(newData)
        .then((taskModel) => {
          this._tasksModel.addTask(taskModel);
          const tasks = this._getSortedTasks();
          this._renderTasksList(tasks);
        })
        .catch(() => {
          taskController.shake();
        });
      return;
    }

    this._api.updateTask(oldData.id, newData)
      .then((taskModel) => {
        const isSuccess = this._tasksModel.updateTask(oldData.id, taskModel);

        if (isSuccess) {
          taskController.render(taskModel);
          this._updateTasks();
        }
      })
      .catch(() => {
        taskController.shake();
      });

  }

  _onSortTypeChange(sortType) {
    this._sortType = sortType;

    const tasks = this._getSortedTasks();
    this._removeTasks();
    this._resetCount();
    this._renderTasksList(tasks);
  }

  _onViewChange() {
    this._showedTasksController.forEach((taskController) => taskController.setDefaultView());
  }

  _onFilterChange() {
    this._updateTasks();
  }

  _onLoadMoreButton() {
    const loadMoreClickHandler = () => {
      this._setCountRender();
      this._renderTasksList(this._tasksModel.getTasks());
    };

    const isExistLoadMoreButton = this._boardEl.contains(this._loadMoreButtonComponent.getElement());

    if (this._tasksModel.getTasks().length > this._showingTasksCount && !isExistLoadMoreButton) {
      render(this._boardEl, this._loadMoreButtonComponent);
      this._loadMoreButtonComponent.setLoadMoreButtonHandler(loadMoreClickHandler);
    }

    if (isExistLoadMoreButton && this._tasksModel.getTasks().length < this._showingTasksCount) {
      removeElement(this._loadMoreButtonComponent);
    }
  }

  _renderTasksList(tasks) {
    const tasksForRender = tasks.slice(0, this._showingTasksCount);
    this._removeTasks();

    tasksForRender.forEach((task) => {
      const taskController = new TaskController(this._tasksListEl, this._onDataChange, this._onViewChange, ModeController.DEFAULT);
      this._showedTasksController.push(taskController);
      taskController.render(task);
    });

    this._onLoadMoreButton();
  }

  _removeTasks() {
    this._showedTasksController.forEach((taskController) => taskController.destroy());
    this._showedTasksController.length = 0;
  }

  _setCountRender() {
    this._showingTasksCount += SHOWING_TASKS_COUNT;
  }

  _updateTasks() {
    const tasks = this._tasksModel.getTasks();

    if (tasks.length === 0) {
      replaceElement(this._tasksListComponent, this._noTasksComponent);
    }

    this._removeTasks();
    this._resetCount();
    this._renderTasksList(tasks);
  }

  _resetCount() {
    this._showingTasksCount = SHOWING_TASKS_COUNT;
  }
}

export default BoardController;
