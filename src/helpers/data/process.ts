import { produce } from "immer";
import lodash from "lodash";
import type { Ensure } from "~/types/utilities";

// todo: should exclude id from below. Make explicitly about docs, i.e. {id: string}

export function compareUpdatedObjAndCreateNewByDiffVals<
  TObj extends Record<string, unknown>,
>(original: TObj, updated: TObj) {
  const newObj: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(original)) {
    const isEqual = lodash.isEqual(value, updated[key]);
    if (!isEqual) {
      newObj[key] = updated[key];
    }
  }

  return newObj as Ensure<Partial<TObj>, "id">;
}

export function deepSortByIndex<TDoc extends { index: number }>(docs: TDoc[]) {
  return produce(docs, (draft) => draft.sort((a, b) => a.index - b.index));
}

/** return slice of arr including start and end indices */
export function sliceEntities<TArr extends { id: string }[]>(
  entities: TArr,
  start: number,
  end: number,
) {
  return entities.filter((_entity, i) => i >= start && i <= end) as TArr;
}

export function sortByIndex<TEntity extends { index: number }>(
  a: TEntity,
  b: TEntity,
) {
  return a.index - b.index;
}

export function getReorderedEntities<
  TEntity extends { id: string; index: number },
>(input: { entities: TEntity[]; active: TEntity; over: TEntity }) {
  const activeEntityUpdated = {
    id: input.active.id,
    newIndex: input.over.index,
  };
  const entitiesSorted = input.entities.sort(sortByIndex);

  if (input.active.index > input.over.index) {
    const nonActiveEntitiesUpdated = sliceEntities(
      entitiesSorted,
      input.over.index,
      input.active.index - 1,
    ).map((entity) => ({
      id: entity.id,
      newIndex: entity.index + 1,
    }));

    return [activeEntityUpdated, ...nonActiveEntitiesUpdated];
  } else {
    const nonActiveEntitiesUpdated = sliceEntities(
      entitiesSorted,
      input.active.index + 1,
      input.over.index,
    ).map((entity) => ({
      id: entity.id,
      newIndex: entity.index - 1,
    }));

    return [...nonActiveEntitiesUpdated, activeEntityUpdated];
  }
}
