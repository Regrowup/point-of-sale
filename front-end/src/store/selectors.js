import { createSelector } from 'reselect';

const getSelectedLayout = createSelector(
  state => state.layouts,
  state => state.selectedLayoutIndex,
  (layouts, selectedLayoutIndex) => layouts[selectedLayoutIndex],
);

export default getSelectedLayout;
