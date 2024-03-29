import { produce } from "immer";
import lodash from "lodash";
import * as z from "zustand";

import type {
  GetObjValue,
  ObjFieldsToStr,
  OmitObjArrProps,
} from "../../_helpers/types";
import type { Store, PageActionFields, SectionActionFields } from "./types";
import { getReorderedEntities, sortByIndex } from "~/helpers/data/process";

// TODO: abstraction for delete (entity with index), order

export const createStore = (input: { initData: Store["data"] }) =>
  z.createStore<Store>((set) => {
    function nonArrAction<
      TKeyStr extends ObjFieldsToStr<OmitObjArrProps<PageActionFields>>,
    >(keys: TKeyStr) {
      return (newValue: GetObjValue<PageActionFields, TKeyStr>) =>
        set(
          produce((store: Store) => {
            lodash.set(store.data, keys, newValue);
          }),
        );
    }

    function sectionNonArrAction<
      TKeyStr extends ObjFieldsToStr<OmitObjArrProps<SectionActionFields>>,
    >(keys: TKeyStr) {
      return (input: {
        id: string;
        updatedValue: GetObjValue<SectionActionFields, TKeyStr>;
      }) =>
        set(
          produce((store: Store) => {
            const entityIndex = store.data.sections.findIndex(
              (section) => section.id === input.id,
            );

            if (entityIndex < 0) {
              return;
            }

            lodash.set(
              store.data.sections[entityIndex],
              keys,
              input.updatedValue,
            );
          }),
        );
    }

    return {
      data: input.initData,

      actions: {
        overWrite: (updatedData) =>
          set(
            produce((store: Store) => {
              store.data = updatedData;
            }),
          ),

        bannerImage: {
          dbConnections: {
            imageId: nonArrAction("bannerImage.dbConnections.imageId"),
          },
          position: {
            x: nonArrAction("bannerImage.position.x"),
            y: nonArrAction("bannerImage.position.y"),
          },
        },

        heading: nonArrAction("heading"),

        mainText: nonArrAction("mainText"),

        sections: {
          create: (newEntry) =>
            set(
              produce((store: Store) => {
                store.data.sections.push(newEntry);
              }),
            ),

          delete: (input) =>
            set(
              produce((store: Store) => {
                const entriesOrdered = store.data.sections.sort(sortByIndex);

                const entityToDeleteIndex = entriesOrdered.findIndex(
                  (t) => t.id === input.id,
                );
                if (entityToDeleteIndex === -1) return;

                entriesOrdered.splice(entityToDeleteIndex, 1);

                for (
                  let i = entityToDeleteIndex;
                  i < entriesOrdered.length;
                  i++
                ) {
                  entriesOrdered[i].index = entriesOrdered[i].index - 1;
                }
              }),
            ),

          reorder: (input) =>
            set(
              produce((store: Store) => {
                const entriesOrdered = store.data.sections.sort(sortByIndex);

                const active = entriesOrdered.find(
                  (t) => t.id === input.activeId,
                );
                const over = entriesOrdered.find((t) => t.id === input.overId);

                if (!active || !over) {
                  return;
                }

                const updatedEntries = getReorderedEntities({
                  active,
                  over,
                  entities: entriesOrdered,
                });

                updatedEntries.forEach((updatedEntry) => {
                  const index = store.data.sections.findIndex(
                    (t) => t.id === updatedEntry.id,
                  );
                  if (index !== -1)
                    store.data.sections[index].index = updatedEntry.newIndex;
                });
              }),
            ),

          bullets: {
            entries: {
              create: (input) =>
                set(
                  produce((store: Store) => {
                    const sectionIndex = store.data.sections.findIndex(
                      (section) => section.id === input.sectionId,
                    );

                    if (sectionIndex < 0) {
                      return;
                    }

                    const section = store.data.sections[sectionIndex];

                    section.bullets.entries.push(input.newEntry);
                  }),
                ),

              delete: (input) =>
                set(
                  produce((store: Store) => {
                    const sectionIndex = store.data.sections.findIndex(
                      (section) => section.id === input.sectionId,
                    );

                    if (sectionIndex < 0) {
                      return;
                    }

                    const section = store.data.sections[sectionIndex];

                    const bulletIndex = section.bullets.entries.findIndex(
                      (bullet) => bullet.id === input.bulletId,
                    );

                    if (bulletIndex < 0) {
                      return;
                    }

                    section.bullets.entries.splice(bulletIndex, 1);
                  }),
                ),

              reorder: (input) =>
                set(
                  produce((store: Store) => {
                    const sectionIndex = store.data.sections.findIndex(
                      (section) => section.id === input.sectionId,
                    );

                    if (sectionIndex < 0) {
                      return;
                    }

                    const section = store.data.sections[sectionIndex];

                    const bulletsOrdered =
                      section.bullets.entries.sort(sortByIndex);

                    const active = bulletsOrdered.find(
                      (t) => t.id === input.bullet.activeId,
                    );
                    const over = bulletsOrdered.find(
                      (t) => t.id === input.bullet.overId,
                    );

                    if (!active || !over) {
                      return;
                    }

                    const updatedBullets = getReorderedEntities({
                      active,
                      over,
                      entities: bulletsOrdered,
                    });

                    updatedBullets.forEach((updatedBullet) => {
                      const index = section.bullets.entries.findIndex(
                        (t) => t.id === updatedBullet.id,
                      );
                      if (index !== -1)
                        section.bullets.entries[index].index =
                          updatedBullet.newIndex;
                    });
                  }),
                ),

              text: (input) =>
                set(
                  produce((store: Store) => {
                    const sectionIndex = store.data.sections.findIndex(
                      (section) => section.id === input.sectionId,
                    );

                    if (sectionIndex < 0) {
                      return;
                    }

                    const section = store.data.sections[sectionIndex];

                    const bulletIndex = section.bullets.entries.findIndex(
                      (bullet) => bullet.id === input.bulletId,
                    );

                    if (bulletIndex < 0) {
                      return;
                    }

                    section.bullets.entries[bulletIndex].text =
                      input.updatedValue;
                  }),
                ),

              title: (input) =>
                set(
                  produce((store: Store) => {
                    const sectionIndex = store.data.sections.findIndex(
                      (section) => section.id === input.sectionId,
                    );

                    if (sectionIndex < 0) {
                      return;
                    }

                    const section = store.data.sections[sectionIndex];

                    const bulletIndex = section.bullets.entries.findIndex(
                      (bullet) => bullet.id === input.bulletId,
                    );

                    if (bulletIndex < 0) {
                      return;
                    }

                    section.bullets.entries[bulletIndex].title =
                      input.updatedValue;
                  }),
                ),
            },

            icon: sectionNonArrAction("bullets.icon"),

            type: sectionNonArrAction("bullets.type"),
          },

          description: sectionNonArrAction("description"),

          colour: sectionNonArrAction("colour"),

          title: sectionNonArrAction("title"),
        },
      },
    };
  });
