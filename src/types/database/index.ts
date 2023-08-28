import type { Career } from "./career";
import type { Footer } from "./footer";
import type { Header } from "./header";
import type { Image } from "./image";
import type { Keyword } from "./keyword";
import type { LinkLabels } from "./linkLabels";
import type { OrgDetails } from "./org-details";
import type { Pages } from "./pages";
import type { ParticipantTestimonial } from "./participant-testimonial";
import type { Partner } from "./partner";
import type { ProfessionalTestimonial } from "./professional-testimonial";
import type { Programme } from "./programme";
import type { Supporter } from "./supporter";
import type { VolunteerPosition } from "./volunteerPosition";
import type { Workshop } from "./workshop";

export type MyDb = {
  pages: Pages;
  image: Image;
  "participant-testimonial": ParticipantTestimonial;
  "professional-testimonial": ProfessionalTestimonial;
  programme: Programme;
  supporter: Supporter;
  partner: Partner;
  ["volunteer-position"]: VolunteerPosition;
  career: Career;
  workshop: Workshop;
  keyword: Keyword;
  singles: {
    orgDetails: OrgDetails;
    linkLabels: LinkLabels;
    header: Header;
    footer: Footer;
  };
};
