import { type ReactElement } from "react";
import { useQuery } from "react-query";

import CmsLayout from "~/components/layouts/Cms";
import SiteLayout from "~/components/layouts/Site";
import { PageDataFetch } from "~/components/PageDataFetch";
import CmsHeader from "~/components/parts/cms-header/+Entry";
import SiteFooter from "~/components/parts/site-footer/+Entry";
import SiteHeader from "~/components/parts/site-header/+Entry";

import { RevisionCx } from "./_state";
import AboutUs from "./about-us/+Entry";
import BannerImage from "./BannerImage";
import OrgHeadings from "./OrgHeadings";
import ParticipantTestimonials from "./participant-testimonials/+Entry";
import Partners from "./partners/+Entry";
import PhotoAlbum from "./photo-album/+Entry";
import Programmes from "./programmes/+Entry";
import SupportUs from "./support-us/+Entry";
import Supporters from "./supporters/+Entry";
import Workshops from "./workshops/+Entry";

import { UedCx } from "~/context/user-editable-data";
import { myDb } from "~/my-firebase/firestore";
import type { MyDb } from "~/types/database";

// MUST DO
// □ delete firestore images that came from now deleted storage image (when playing around with compression)

// CHECK
// □ check image blur up works
// □ remove sheet url from .env.local
// □ firestore + storage rules - open reads is unavoidable?
// □ remove unneeded users (ruben@virt....com) from firebase console

// TO DO

// REFACTOR
// □ abstraction for react-query onMutate, onSuccess, etc.?
// □ image abstraction?
// □ abstraction for unfound entity: e.g. image, programme, supporter.

// OTHER

// □ On toggleable elements, can put toggle on actual element menu as well as top bar.
// □ AuthContext logic, along with firebase initauthstate, seems flawed. Probs need to extract initauthstate into its own context
// □ need to have production values in env.local?
// □ use zod in saving to db?
// □ careersPage.careers.text is never used? Should be?
// □ site header overflows. Visible if placeholders there, since they are long.
// □ should be able to work out by aspect ratio of image container and aspect ratio of image natural dimensions whether can move up/down and/or left/right.
// □ in revision.cx, on save success should use func input to update 'current db data'
// □ UserEditableDataCx should be renamed - have other editable Cx e.g. new testimonial. Rename to e.g. page editable cx
// □ missed toasts - e.g. on reorder
// □ should derive e.g. testimonial type from state used rather than db?
// □ ideally, don't want to show position buttons if there's an image error (unfound image) either. Would need to recomposoe image state or equivalent.
// □ Should have a subtle emboss of section name in each section? Maybe only if one/more text elements have no text
// □ supporters modal tooltip for 'add to landing' is incorrect since modal is for all supporters
// □ should memoise in revisionCx?
// □ rework process entity logic + types. Want to keep ids. Types could be improved. Must be a lodash helper? lodash.set as used in UedCx?
// □ on could not find entity page, etc., have cms header there + bg, though no revision buttons
// □ make preview modal abstraction. Apply to each page.
// □ Is a double scroll bar in edit team members
// □ prop Option to have darker bg
// □ autofocus still triggers on textinputform
// □ option to toggle programme subtitle
// □ component menu delete button. Need span around icon? Want to be able to have text-gray-400 on cms.editbar. text needs to go red when hover on outer wrapper - not working properly.
// □ previews, e.g. programme section spreview, is vertically responsive?
// □ abstraction for preview. Apply sitelayout width
// □ dbreadcx is misnamed I think. It doesn't receive data from db directly. It just passes data.
// □ add info on programme and workshop pg should be a modal
// □ make form nicer. Only silde the text. Keep button in place but animate text within.
// □ workshop subtitle option on workshops page. put toggle button? Would have to be on modal too.
// □ short main texts shouldn't go to double columns
// □ apply e.g. responsive changes form frontend to this cms.
// □ clean up firestore functs. Some unneccessary. Apply helpers.
// □ ui feedback for e.g. image upload timeout.

// STATE
// □ could have a queryOne in state data e.g. for programmes/testimonials

// NEW SITE (if funding)
// □ living wage employer section in about us

// todo: Will have to remove undo keys from text-input/area form? Re-work revision daat? make an unod key context?

const HomePage = () => (
  <InitDbData>
    {(initDbData) => (
      <UedProviders initDbData={initDbData}>
        <RevisionCx.Provider>
          {(revisionState) => (
            <CmsLayout.Body>
              <CmsHeader
                actions={revisionState.actions}
                data={{ isChange: revisionState.data.isChange }}
              />
              <SiteLayout.Body>
                <SiteHeader />

                <BannerImage />

                <SiteLayout.Section.Spacing>
                  <OrgHeadings />
                </SiteLayout.Section.Spacing>

                <SiteLayout.Section.Spacing>
                  <ParticipantTestimonials />
                </SiteLayout.Section.Spacing>

                <SiteLayout.Section.Spacing>
                  <AboutUs />
                </SiteLayout.Section.Spacing>

                <SiteLayout.Section.Spacing>
                  <Workshops />
                </SiteLayout.Section.Spacing>

                <SiteLayout.Section.Spacing>
                  <Programmes />
                </SiteLayout.Section.Spacing>

                <SiteLayout.Section.Spacing.Vertical>
                  <PhotoAlbum />
                </SiteLayout.Section.Spacing.Vertical>

                <SiteLayout.Section.Spacing>
                  <SupportUs />
                </SiteLayout.Section.Spacing>

                <SiteLayout.Section.Spacing>
                  <Partners />
                </SiteLayout.Section.Spacing>

                <SiteLayout.Section.Spacing>
                  <Supporters />
                </SiteLayout.Section.Spacing>

                <SiteLayout.Section.Spacing.Horizontal>
                  <div className="mt-2xl pb-xl">
                    <SiteFooter />
                  </div>
                </SiteLayout.Section.Spacing.Horizontal>
              </SiteLayout.Body>
            </CmsLayout.Body>
          )}
        </RevisionCx.Provider>
      </UedProviders>
    )}
  </InitDbData>
);

export default HomePage;

type DbData = {
  page: MyDb["pages"]["landing"];
  "participant-testimonials": MyDb["participant-testimonial"][];
  programmes: MyDb["programme"][];
  supporters: MyDb["supporter"][];
  partners: MyDb["partner"][];
  orgDetails: MyDb["singles"]["orgDetails"];
  linkLabels: MyDb["singles"]["linkLabels"];
  header: MyDb["singles"]["header"];
  footer: MyDb["singles"]["footer"];
};

const InitDbData = ({
  children,
}: {
  children: (data: DbData) => ReactElement;
}) => {
  const pageQuery = useQuery("landing", myDb.pages.landing.fetch);

  const footerQuery = useQuery("footer", myDb.footer.fetch);
  const headerQuery = useQuery("header", myDb.header.fetch);
  const linkLabelsQuery = useQuery("link-labels", myDb.linkLabels.fetch);
  const orgDetailsQuery = useQuery("org-details", myDb.orgDetails.fetch);

  const participantTestimonialsQuery = useQuery(
    "participant-testimonials",
    myDb["participant-testimonial"].fetchAll,
  );
  const programmesQuery = useQuery("programmes", myDb.programme.fetchAll);
  const supportersQuery = useQuery("supporters", myDb.supporter.fetchAll);
  const partnersQuery = useQuery("partners", myDb.partner.fetchAll);

  if (
    pageQuery.isLoading ||
    participantTestimonialsQuery.isLoading ||
    programmesQuery.isLoading ||
    supportersQuery.isLoading ||
    partnersQuery.isLoading ||
    linkLabelsQuery.isLoading ||
    headerQuery.isLoading ||
    footerQuery.isLoading ||
    orgDetailsQuery.isLoading
  ) {
    return <PageDataFetch.Loading />;
  }

  if (
    pageQuery.isError ||
    !pageQuery.data ||
    participantTestimonialsQuery.isError ||
    !participantTestimonialsQuery.data ||
    programmesQuery.isError ||
    !programmesQuery.data ||
    supportersQuery.isError ||
    !supportersQuery.data ||
    partnersQuery.isError ||
    !partnersQuery.data ||
    linkLabelsQuery.isError ||
    !linkLabelsQuery.data ||
    headerQuery.isError ||
    !headerQuery.data ||
    footerQuery.isError ||
    !footerQuery.data ||
    orgDetailsQuery.isError ||
    !orgDetailsQuery.data
  ) {
    return <PageDataFetch.Error />;
  }

  return children({
    page: pageQuery.data,

    orgDetails: orgDetailsQuery.data,
    linkLabels: linkLabelsQuery.data,
    header: headerQuery.data,
    footer: footerQuery.data,

    "participant-testimonials": participantTestimonialsQuery.data,

    programmes: programmesQuery.data,
    supporters: supportersQuery.data,
    partners: partnersQuery.data,
  });
};

const UedProviders = ({
  initDbData,
  children,
}: {
  initDbData: DbData;
  children: ReactElement;
}) => {
  return (
    <UedCx.Pages.Landing.Provider initData={initDbData.page}>
      <UedCx.OrgDetails.Provider initData={initDbData.orgDetails}>
        <UedCx.LinkLabels.Provider initData={initDbData.linkLabels}>
          <UedCx.Header.Provider initData={initDbData.header}>
            <UedCx.Footer.Provider initData={initDbData.footer}>
              <UedCx.Programmes.Provider initData={initDbData.programmes}>
                <UedCx.ParticipantTestimonials.Provider
                  initData={initDbData["participant-testimonials"]}
                >
                  <UedCx.Supporters.Provider initData={initDbData.supporters}>
                    <UedCx.Partners.Provider initData={initDbData.partners}>
                      {children}
                    </UedCx.Partners.Provider>
                  </UedCx.Supporters.Provider>
                </UedCx.ParticipantTestimonials.Provider>
              </UedCx.Programmes.Provider>
            </UedCx.Footer.Provider>
          </UedCx.Header.Provider>
        </UedCx.LinkLabels.Provider>
      </UedCx.OrgDetails.Provider>
    </UedCx.Pages.Landing.Provider>
  );
};
