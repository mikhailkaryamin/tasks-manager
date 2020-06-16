import BoardController from './controllers/board-controller.js';
import FiltersComponent from './components/filters.js';
import MenuComponent from './components/menu.js';
import {generateFilters} from './mock/filter.js';
import {render} from './utils/render.js';
import {generateTasks} from './mock/task.js';
import {TASK_COUNT} from './const.js';

const filters = generateFilters();
const tasks = generateTasks(TASK_COUNT);

const menuComponent = new MenuComponent();
const filtersComponent = new FiltersComponent(filters);

const mainEl = document.querySelector(`.main`);
const boardController = new BoardController(mainEl);
const mainControlEl = mainEl.querySelector(`.main__control`);

render(mainControlEl, menuComponent);
render(mainEl, filtersComponent);

boardController.render(tasks);
