const DAYS = [`mo`, `tu`, `we`, `th`, `fr`, `sa`, `su`];
const Color = {
  BLACK: `black`,
  YELLOW: `yellow`,
  BLUE: `blue`,
  GREEN: `green`,
  PINK: `pink`,
};

const COLORS = Object.values(Color);
const DESCRIPTION_ITEMS = [
  `Est tempor sint est nostrud nostrud exercitation.`,
  `Exercitation consequat elit irure eu magna proident commodo.`,
  `Amet ad reprehenderit est eiusmod esse.`,
];
const TASK_COUNT = 50;
const FILTER_ID_PREFIX = `filter__`;
const SortType = {
  DATE_DOWN: `date-down`,
  DATE_UP: `date-up`,
  DEFAULT: `default`,
};
const FilterType = {
  ALL: `all`,
  OVERDUE: `overdue`,
  TODAY: `today`,
  FAVORITES: `favorites`,
  REPEATING: `repeating`,
  ARCHIVE: `archive`,
};
const SHOWING_TASKS_COUNT = 8;
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
const NodePosition = {
  APPEND: `append`,
  PREPEND: `prepend`,
};
const ModeController = {
  NEW_TASK: `newTask`,
  DEFAULT: `default`,
};
const MIN_DESCRIPTION_LENGTH = 1;
const MAX_DESCRIPTION_LENGTH = 140;
const EscKeyName = {
  FULL: `Escape`,
  CUT: `Esc`,
};

export {
  Color,
  COLORS,
  DAYS,
  DESCRIPTION_ITEMS,
  EscKeyName,
  FilterType,
  FILTER_ID_PREFIX,
  SHOWING_TASKS_COUNT,
  SortType,
  TASK_COUNT,
  EMPTY_TASK,
  NodePosition,
  ModeController,
  MIN_DESCRIPTION_LENGTH,
  MAX_DESCRIPTION_LENGTH,
};
