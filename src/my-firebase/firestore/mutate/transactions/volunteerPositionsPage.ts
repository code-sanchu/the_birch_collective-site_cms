import { writeBatch } from "firebase/firestore/lite";

import { myDb } from "../..";

import { firestore } from "~/my-firebase/client";
import type { MyDb } from "~/types/database";
import type { DocPartialWithId } from "~/types/database/_helpers";
import type { MyPick } from "~/types/utilities";

type Page = MyDb["pages"]["volunteer-positions"];

export const volunteerPositionsPageTransaction = async (input: {
  page: (MyPick<Page, "id"> & Partial<Page>) | null;

  orgDetails: Partial<MyDb["singles"]["orgDetails"]> | null;
  linkLabels: Partial<MyDb["singles"]["linkLabels"]> | null;
  header: Partial<MyDb["singles"]["header"]> | null;
  footer: Partial<MyDb["singles"]["footer"]> | null;

  keywords: {
    updated: DocPartialWithId<MyDb["keyword"]>[];
    created: MyDb["keyword"][];
    deleted: string[];
  };

  volunteerPositions: {
    updated: DocPartialWithId<MyDb["volunteer-position"]>[];
    created: MyDb["volunteer-position"][];
    deleted: string[];
  };
}) => {
  const batch = writeBatch(firestore);

  if (input.page) {
    myDb.pages["volunteer-positions"].batch.update(input.page, batch);
  }

  if (input.orgDetails) {
    myDb.orgDetails.batch.update(input.orgDetails, batch);
  }
  if (input.header) {
    myDb.header.batch.update(input.header, batch);
  }
  if (input.footer) {
    myDb.footer.batch.update(input.footer, batch);
  }
  if (input.linkLabels) {
    myDb.linkLabels.batch.update(input.linkLabels, batch);
  }

  if (input.keywords.created.length) {
    input.keywords.created.forEach((keyword) =>
      myDb["keyword"].batch.create(keyword, batch),
    );
  }
  if (input.keywords.updated.length) {
    input.keywords.updated.forEach((keyword) =>
      myDb["keyword"].batch.update(keyword, batch),
    );
  }
  if (input.keywords.deleted.length) {
    input.keywords.deleted.forEach((id) =>
      myDb["keyword"].batch.delete(id, batch),
    );
  }

  if (input.volunteerPositions.created.length) {
    input.volunteerPositions.created.forEach((volunteerPosition) =>
      myDb["volunteer-positions"].batch.create(volunteerPosition, batch),
    );
  }
  if (input.volunteerPositions.updated.length) {
    input.volunteerPositions.updated.forEach((volunteerPosition) =>
      myDb["volunteer-positions"].batch.update(volunteerPosition, batch),
    );
  }
  if (input.volunteerPositions.deleted.length) {
    input.volunteerPositions.deleted.forEach((id) =>
      myDb["volunteer-positions"].batch.delete(id, batch),
    );
  }

  await batch.commit();
};
