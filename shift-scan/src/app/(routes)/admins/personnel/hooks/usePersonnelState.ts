import { useReducer } from 'react';
import { PersonnelState, PersonnelAction, PersonnelView } from '../types';

const initialState: PersonnelState = {
  view: 'list',
  selectedEmployee: null,
  selectedCrew: null,
  searchQuery: '',
  isDirty: false,
};

function personnelReducer(state: PersonnelState, action: PersonnelAction): PersonnelState {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, view: action.payload };
    case 'SELECT_EMPLOYEE':
      return { ...state, selectedEmployee: action.payload };
    case 'SELECT_CREW':
      return { ...state, selectedCrew: action.payload };
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload };
    case 'SET_DIRTY':
      return { ...state, isDirty: action.payload };
    default:
      return state;
  }
}

export function usePersonnelState() {
  const [state, dispatch] = useReducer(personnelReducer, initialState);

  const setView = (view: PersonnelView) => dispatch({ type: 'SET_VIEW', payload: view });
  const selectEmployee = (employee: Employee | null) => dispatch({ type: 'SELECT_EMPLOYEE', payload: employee });
  const selectCrew = (crew: Crew | null) => dispatch({ type: 'SELECT_CREW', payload: crew });
  const setSearch = (query: string) => dispatch({ type: 'SET_SEARCH', payload: query });
  const setDirty = (isDirty: boolean) => dispatch({ type: 'SET_DIRTY', payload: isDirty });

  return {
    state,
    setView,
    selectEmployee,
    selectCrew,
    setSearch,
    setDirty,
  };
}
