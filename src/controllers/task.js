import CardTaskComponent from '../components/card-task.js';
import CardTaskEditComponent from '../components/card-task-edit.js';
import {
  replaceElement,
  render,
} from '../utils/render.js';
import {onEscKeyDown} from '../utils/common.js';

class TaskController {
  constructor(container, onDataChange, onViewChange) {
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._container = container;
    this._cardTask = null;
    this._cardTaskEdit = null;
  }

  render(task) {
    const oldCardTaskComponent = this._cardTask;
    const oldCardTaskEditComponent = this._cardTaskEdit;

    this._cardTask = new CardTaskComponent(task);
    this._cardTaskEdit = new CardTaskEditComponent(task);

    const onCloseEdit = (evt) => {
      onEscKeyDown(evt, replaceEditToTask);
    };

    const replaceTaskToEdit = () => {
      this._onViewChange();
      replaceElement(this._cardTaskEdit, this._cardTask);
    };

    const replaceEditToTask = () => {
      replaceElement(this._cardTask, this._cardTaskEdit);
    };

    this._cardTaskEdit.setSubmitHandler((evt) => {
      evt.preventDefault();
      replaceEditToTask();
      document.removeEventListener(`keydown`, onCloseEdit);
    });

    this._cardTask.setEditButtonHandler(() => {
      replaceTaskToEdit();
      document.addEventListener(`keydown`, onCloseEdit);
    });

    this._cardTask.setFavoriteButtonHandler(() => {
      const newData = Object.assign({}, task, {
        isFavorite: !task.isFavorite,
      });

      this._onDataChange(this, task, newData);
    });

    this._cardTask.setArchiveButtonHandler(() => {
      const newData = Object.assign({}, task, {
        isArchive: !task.isArchive,
      });

      this._onDataChange(this, task, newData);
    });

    if (oldCardTaskComponent && oldCardTaskEditComponent) {
      replaceElement(this._cardTask, oldCardTaskComponent);
      replaceElement(this._cardTaskEdit, oldCardTaskEditComponent);
    } else {
      render(this._container, this._cardTask);
    }

  }

  setDefaultView() {
    const cardTaskEl = this._cardTask.getElement();
    const isCloseTaskEdit = cardTaskEl.parentElement;

    if (isCloseTaskEdit) {
      return;
    }

    replaceElement(this._cardTask, this._cardTaskEdit);
  }
}

export default TaskController;
