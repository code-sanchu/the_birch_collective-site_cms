import { writeBatch } from "firebase/firestore/lite";

import { myDb } from "../..";

import { firestore } from "~/my-firebase/client";
import type { MyDb } from "~/types/database";
import type { DocPartialWithId } from "~/types/database/_helpers";
import type { MyPick } from "~/types/utilities";

type Page = MyDb["pages"]["landing"];

export const landingPageTransaction = async (input: {
  page: (MyPick<Page, "id"> & Partial<Page>) | null;

  orgDetails: Partial<MyDb["singles"]["orgDetails"]> | null;
  linkLabels: Partial<MyDb["singles"]["linkLabels"]> | null;
  header: Partial<MyDb["singles"]["header"]> | null;
  footer: Partial<MyDb["singles"]["footer"]> | null;

  images: {
    updated: DocPartialWithId<MyDb["image"]>[];
    // deleted: string[];
  };
  keywords: {
    updated: DocPartialWithId<MyDb["keyword"]>[];
    created: MyDb["keyword"][];
    deleted: string[];
  };

  testimonials: {
    updated: DocPartialWithId<MyDb["participant-testimonial"]>[];
    created: MyDb["participant-testimonial"][];
    deleted: string[];
  };
  programmes: {
    updated: DocPartialWithId<MyDb["programme"]>[];
    created: MyDb["programme"][];
    deleted: string[];
  };
  supporters: {
    updated: DocPartialWithId<MyDb["supporter"]>[];
    created: MyDb["supporter"][];
    deleted: string[];
  };
  partners: {
    updated: DocPartialWithId<MyDb["partner"]>[];
    created: MyDb["partner"][];
    deleted: string[];
  };
}) => {
  const batch = writeBatch(firestore);

  if (input.page) {
    myDb.pages.landing.batch.update(input.page, batch);
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

  if (input.images.updated.length) {
    input.images.updated.forEach((image) =>
      myDb["image"].batch.update(image, batch),
    );
  }
  /*   if (input.images.deleted.length) {
    input.images.deleted.forEach((id) =>
      myDb["image"].batch.delete(id, batch),
    );
  } */
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

  if (input.testimonials.created.length) {
    input.testimonials.created.forEach((testimonial) =>
      myDb["participant-testimonial"].batch.create(testimonial, batch),
    );
  }
  if (input.testimonials.updated.length) {
    input.testimonials.updated.forEach((testimonial) =>
      myDb["participant-testimonial"].batch.update(testimonial, batch),
    );
  }
  if (input.testimonials.deleted.length) {
    input.testimonials.deleted.forEach((id) =>
      myDb["participant-testimonial"].batch.delete(id, batch),
    );
  }

  if (input.programmes.created.length) {
    input.programmes.created.forEach((programme) =>
      myDb.programme.batch.create(programme, batch),
    );
  }
  if (input.programmes.updated.length) {
    input.programmes.updated.forEach((programme) =>
      myDb.programme.batch.update(programme, batch),
    );
  }
  if (input.programmes.deleted.length) {
    input.programmes.deleted.forEach((id) =>
      myDb.programme.batch.delete(id, batch),
    );
  }

  if (input.supporters.created.length) {
    input.supporters.created.forEach((supporter) =>
      myDb.supporter.batch.create(supporter, batch),
    );
  }
  if (input.supporters.updated.length) {
    input.supporters.updated.forEach((supporter) =>
      myDb.supporter.batch.update(supporter, batch),
    );
  }
  if (input.supporters.deleted.length) {
    input.supporters.deleted.forEach((id) =>
      myDb.supporter.batch.delete(id, batch),
    );
  }

  if (input.partners.created.length) {
    input.partners.created.forEach((partner) =>
      myDb.partner.batch.create(partner, batch),
    );
  }
  if (input.partners.updated.length) {
    input.partners.updated.forEach((partner) =>
      myDb.partner.batch.update(partner, batch),
    );
  }
  if (input.partners.deleted.length) {
    input.partners.deleted.forEach((id) =>
      myDb.partner.batch.delete(id, batch),
    );
  }

  await batch.commit();
};
