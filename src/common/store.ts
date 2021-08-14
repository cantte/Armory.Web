import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import UsersReducer from '../modules/users/Slice';
import SquadronsReducer from '../modules/squadrons/Slice';
import SquadsReducer from '../modules/squads/Slice';
import PeopleReducer from '../modules/people/Slice';
import AmmunitionReducer from '../modules/armament/ammunition/Slice';
import EquipmentsReducer from '../modules/armament/equipments/Slice';
import ExplosivesReducer from '../modules/armament/explosives/Slice';
import WeaponsReducer from '../modules/armament/weapons/Slice';
import RanksReducer from '../modules/ranks/Slice';
import DegreesReducer from '../modules/degrees/Slice';
import TroopersReducer from '../modules/troopers/Slice';
import ApplicationReducer from '../modules/application/Slice';

export const store = configureStore({
  reducer: {
    application: ApplicationReducer,
    user: UsersReducer,
    squadron: SquadronsReducer,
    squads: SquadsReducer,
    people: PeopleReducer,
    ammunition: AmmunitionReducer,
    equipments: EquipmentsReducer,
    explosives: ExplosivesReducer,
    weapons: WeaponsReducer,
    ranks: RanksReducer,
    degrees: DegreesReducer,
    troopers: TroopersReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
