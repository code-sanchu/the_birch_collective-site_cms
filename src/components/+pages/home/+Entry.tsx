// logo, org name - not editable
// banner image + title needn't be movable
import { type ReactElement } from "react";
import { useQuery } from "react-query";

import { myDb } from "~/my-firebase/firestore";

import { UserEditableDataCx, type UserEditableDbData } from "./_state";
import { RevisionCx } from "./_state/RevisionCx";

import { PageDataFetch } from "~/components/PageDataFetch";
import CmsHeader from "~/components/parts/cms-header/+Entry";
import SiteHeader from "~/components/parts/site-header/+Entry";
import SiteFooter from "~/components/parts/site-footer/+Entry";

import BannerImage from "./BannerImage";
import OrgHeadings from "./OrgHeadings";
import Testimonials from "./testimonials/+Entry";
import AboutUs from "./about-us/+Entry";
import SiteLayout from "~/components/layouts/Site";
import Workshops from "./workshops/+Entry";
import Programmes from "./programmes/+Entry";
import PhotoAlbum from "./photo-album/+Entry";
import SupportUs from "./support-us/+Entry";
import Supporters from "./supporters/+Entry";
import CmsLayout from "~/components/layouts/Cms";

// □ need to have production values in env.local?
// □ abstraction for react-query onMutate, onSuccess, etc.
// □ use zod in saving to db?
// □ check image blur up works.
// □ should be able to work out by aspect ratio of image container and aspect ratio of image natural dimensions whether can move up/down and/or left/right.
// □ maybe do image abstraction.
// □ in revision.cx, on save success should use func input to update 'current db data'
// □ UserEditableDataCx should be renamed - have other editable Cx e.g. new testimonial. Rename to e.g. page editable cx
// □ abstraction for unfound entity: e.g. image, programme, supporter.
// □ go over each text input and area form + add key where applicable
// □ in e.g. textInputForm, return input value as first arg, and anything else, such as an onSubmit callback, as field in obj as second arg - that way can pass a function that takes inputVal as it's only arg without an extra func.
// □ missed toasts - e.g. on reorder

// □ Should have a subtle emboss of section name in each section? Maybe only if one/more text elements have no text
// □ All inputs should have undo key
// □ supporters modal tooltip for 'add to landing' is incorrect since modal is for all supporters

// todo: Refactor. Maybe not too much.

const HomePage = () => (
  <InitData>
    {(initDbData) => (
      <UserEditableDataCx.Provider initDbData={initDbData}>
        <RevisionCx.Provider initDbData={initDbData}>
          {({ actions, data }) => (
            <CmsLayout.Body>
              <CmsHeader actions={actions} data={{ isChange: data.isChange }} />
              <SiteLayout.Body
              /*                 styles={{
                  outer:
                    "h-full flex-grow overflow-y-auto overflow-x-hidden bg-gray-100 scrollbar-thin",
                  inner: "p-sm pr-md",
                }} */
              >
                <SiteHeader />
                <BannerImage />
                <SiteLayout.Section.Spacing>
                  <OrgHeadings />
                </SiteLayout.Section.Spacing>
                <SiteLayout.Section.Spacing>
                  <Testimonials />
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
      </UserEditableDataCx.Provider>
    )}
  </InitData>
);

export default HomePage;

const InitData = ({
  children,
}: {
  children: (data: UserEditableDbData) => ReactElement;
}) => {
  const landingQuery = useQuery("landing", myDb.pages.landing.fetch);
  const testimonialsQuery = useQuery("testimonials", myDb.testimonial.fetchAll);
  const programmesQuery = useQuery("programmes", myDb.programme.fetchAll);
  const supportersQuery = useQuery("supporters", myDb.supporter.fetchAll);
  const orgDetailsQuery = useQuery("org-details", myDb.orgDetails.fetch);
  const linkLabelsQuery = useQuery("link-labels", myDb.linkLabels.fetch);
  const headerQuery = useQuery("header", myDb.header.fetch);
  const footerQuery = useQuery("footer", myDb.footer.fetch);

  if (
    landingQuery.isLoading ||
    testimonialsQuery.isLoading ||
    programmesQuery.isLoading ||
    supportersQuery.isLoading ||
    linkLabelsQuery.isLoading ||
    headerQuery.isLoading ||
    footerQuery.isLoading ||
    orgDetailsQuery.isLoading
  ) {
    return <PageDataFetch.Loading />;
  }

  if (
    landingQuery.isError ||
    !landingQuery.data ||
    testimonialsQuery.isError ||
    !testimonialsQuery.data ||
    programmesQuery.isError ||
    !programmesQuery.data ||
    supportersQuery.isError ||
    !supportersQuery.data ||
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
    page: landingQuery.data,
    testimonials: testimonialsQuery.data,
    programmes: programmesQuery.data,
    supporters: supportersQuery.data,
    orgDetails: orgDetailsQuery.data,
    linkLabels: linkLabelsQuery.data,
    header: headerQuery.data,
    footer: footerQuery.data,
  });
};
