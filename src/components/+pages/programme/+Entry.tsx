import { type ReactElement } from "react";
import { useQuery } from "react-query";

import { PageFramework } from "~/components/frameworks";
import SiteLayout from "~/components/layouts/Site";
import { PageDataFetch } from "~/components/PageDataFetch";
import CmsHeader from "~/components/parts/cms-header/+Entry";

import { RevisionCx } from "./_state";
import BannerImage from "./banner-image/+Entry";
import Headings from "./headings/+Entry";
import Info from "./info/+Entry";
import MainText from "./main-text/+Entry";
import PhotoAlbum from "./photo-album/+Entry";
import Posters from "./posters/+Entry";
import Sections from "./sections/+Entry";
import SignUp from "./sign-up/+Entry";
import TopEditBar from "./top-edit-bar/+Entry";

import { UedCx } from "~/context/user-editable-data";
import { useDynamicRouteParams } from "~/hooks";
import { myDb } from "~/my-firebase/firestore";
import type { MyDb } from "~/types/database";

const AboutPage = () => (
  <AwaitParams>
    {({ paramId }) => (
      <InitDbData idParam={paramId}>
        {(initDbData) => (
          <UedProviders initDbData={initDbData}>
            <RevisionCx.Provider>
              {(revisionState) => (
                <PageFramework
                  cmsHeader={
                    <CmsHeader
                      actions={revisionState.actions}
                      data={{ isChange: revisionState.data.isChange }}
                    />
                  }
                  pageSpecificComponents={<PageSpecificComponents />}
                />
              )}
            </RevisionCx.Provider>
          </UedProviders>
        )}
      </InitDbData>
    )}
  </AwaitParams>
);

export default AboutPage;

const PageSpecificComponents = () => {
  const {
    store: {
      data: { usePosters, photoAlbum },
    },
  } = UedCx.Programme.use();

  return (
    <>
      <SiteLayout.Section.Spacing.Horizontal>
        <TopEditBar />
      </SiteLayout.Section.Spacing.Horizontal>

      <div className="mt-sm">
        <BannerImage />
      </div>

      <SiteLayout.Section.Spacing>
        <Headings />
      </SiteLayout.Section.Spacing>

      <SiteLayout.Section.Spacing.Horizontal>
        <MainText />
      </SiteLayout.Section.Spacing.Horizontal>

      <SiteLayout.Section.Spacing>
        <SignUp />
      </SiteLayout.Section.Spacing>

      <SiteLayout.Section.Spacing>
        <div className="grid grid-cols-2 gap-lg">
          <div className="">
            <Info />
          </div>
          {usePosters ? (
            <div className="">
              <Posters />
            </div>
          ) : null}
        </div>
      </SiteLayout.Section.Spacing>

      {photoAlbum.use ? (
        <SiteLayout.Section.Spacing>
          <PhotoAlbum />
        </SiteLayout.Section.Spacing>
      ) : null}

      <SiteLayout.Section.Spacing>
        <Sections />
      </SiteLayout.Section.Spacing>
    </>
  );
};

type DbData = {
  programme: MyDb["programme"];
  orgDetails: MyDb["singles"]["orgDetails"];
  linkLabels: MyDb["singles"]["linkLabels"];
  header: MyDb["singles"]["header"];
  footer: MyDb["singles"]["footer"];
};

const AwaitParams = ({
  children,
}: {
  children: (arg0: { paramId: string }) => ReactElement;
}) => {
  const params = useDynamicRouteParams();

  if (params === "pending" || !params.idParam) {
    return <PageDataFetch.Loading />;
  }

  return children({ paramId: params.idParam });
};

const InitDbData = ({
  children,
  idParam,
}: {
  children: (data: DbData) => ReactElement;
  idParam: string;
}) => {
  const programmeQuery = useQuery(
    ["programme", idParam],
    async () => await myDb.programme.fetchOne(idParam),
  );

  const footerQuery = useQuery("footer", myDb.footer.fetch);
  const headerQuery = useQuery("header", myDb.header.fetch);
  const linkLabelsQuery = useQuery("link-labels", myDb.linkLabels.fetch);
  const orgDetailsQuery = useQuery("org-details", myDb.orgDetails.fetch);

  if (
    programmeQuery.isLoading ||
    linkLabelsQuery.isLoading ||
    headerQuery.isLoading ||
    footerQuery.isLoading ||
    orgDetailsQuery.isLoading ||
    programmeQuery.isLoading
  ) {
    return <PageDataFetch.Loading />;
  }

  if (programmeQuery.isError) {
    return <PageDataFetch.Error />;
  }

  if (!programmeQuery.data) {
    return <PageDataFetch.NotFound entityName="programme" />;
  }

  if (
    linkLabelsQuery.isError ||
    !linkLabelsQuery.data ||
    headerQuery.isError ||
    !headerQuery.data ||
    footerQuery.isError ||
    !footerQuery.data ||
    orgDetailsQuery.isError ||
    !orgDetailsQuery.data ||
    programmeQuery.isError ||
    !programmeQuery.data
  ) {
    return <PageDataFetch.Error />;
  }

  return children({
    programme: programmeQuery.data,
    orgDetails: orgDetailsQuery.data,
    linkLabels: linkLabelsQuery.data,
    header: headerQuery.data,
    footer: footerQuery.data,
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
    <UedCx.OrgDetails.Provider initData={initDbData.orgDetails}>
      <UedCx.LinkLabels.Provider initData={initDbData.linkLabels}>
        <UedCx.Header.Provider initData={initDbData.header}>
          <UedCx.Footer.Provider initData={initDbData.footer}>
            <UedCx.Programme.Provider
              initData={initDbData.programme}
              key={initDbData.programme.id}
            >
              {children}
            </UedCx.Programme.Provider>
          </UedCx.Footer.Provider>
        </UedCx.Header.Provider>
      </UedCx.LinkLabels.Provider>
    </UedCx.OrgDetails.Provider>
  );
};
