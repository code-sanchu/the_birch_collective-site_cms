import type { GenerateNonArrActions } from "~/context/user-editable-data/_helpers/types";
import type { MyDb } from "~/types/database";

export type Store = {
  data: Section;
  actions: Actions;
};

export type Section = MyDb["workshop"]["sections"][number];

type NonArrActions = GenerateNonArrActions<Section>;

type Actions = {
  resetData: (data: Section) => void;
} & NonArrActions;
