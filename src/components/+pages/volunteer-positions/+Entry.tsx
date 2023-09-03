/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { type ReactElement } from "react";
import { useQuery } from "react-query";

import { PageFramework } from "~/components/frameworks";
import SiteLayout from "~/components/layouts/Site";
import { PageDataFetch } from "~/components/PageDataFetch";
import CmsHeader from "~/components/parts/cms-header/+Entry";

import { CommonData, type CommonDbData } from "../_containers";
import { RevisionCx } from "./_state";
import BannerImage from "./banner-image/+Entry";
import Heading from "./heading/+Entry";
import MainText from "./main-text/+Entry";
import Opportunities from "./opportunites/+Entry";

import { UedCx } from "~/context/user-editable-data";
import { myDb } from "~/my-firebase/firestore";
import type { MyDb } from "~/types/database";

const VolunteerPositionsPage = () => (
  <InitDbData>
    {(dbData) => (
      <UserEditProviders dbData={dbData}>
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
      </UserEditProviders>
    )}
  </InitDbData>
);

export default VolunteerPositionsPage;

const PageSpecificComponents = () => (
  <>
    <BannerImage />

    <SiteLayout.Section.Spacing>
      <Heading />
    </SiteLayout.Section.Spacing>

    <SiteLayout.Section.Spacing.Horizontal>
      <MainText />
    </SiteLayout.Section.Spacing.Horizontal>

    <SiteLayout.Section.Spacing>
      <Opportunities />
    </SiteLayout.Section.Spacing>
  </>
);

type PageDbData = {
  page: MyDb["pages"]["volunteer-positions"];

  volunteerPositions: MyDb["volunteer-position"][];
};

type DbData = {
  common: CommonDbData;

  page: PageDbData;
};

const usePageSpecificDbDataInit = () => {
  const pageQuery = useQuery(
    "volunteer-positions-page",
    myDb.pages["volunteer-positions"].fetch,
  );

  const volunteerPositionsQuery = useQuery(
    "volunteer-position",
    myDb["volunteer-positions"].fetchAll,
  );

  return {
    pageQuery,
    volunteerPositionsQuery,
  };
};

const InitDbData = ({
  children,
}: {
  children: (data: DbData) => ReactElement;
}) => {
  const { pageQuery, volunteerPositionsQuery } = usePageSpecificDbDataInit();

  const {
    footerQuery,
    headerQuery,
    imagesQuery,
    keywordsQuery,
    linkLabelsQuery,
    orgDetailsQuery,
  } = CommonData.useQueries();

  const queriesArr = [
    ...[
      footerQuery,
      headerQuery,
      imagesQuery,
      keywordsQuery,
      linkLabelsQuery,
      orgDetailsQuery,
    ],
    ...[pageQuery, volunteerPositionsQuery],
  ];

  if (queriesArr.some((query) => query.isLoading)) {
    return <PageDataFetch.Loading />;
  }

  if (
    queriesArr.some((query) => query.isError) ||
    queriesArr.some((query) => !query.data)
  ) {
    return <PageDataFetch.Error />;
  }

  return children({
    page: {
      page: pageQuery.data!,
      volunteerPositions: volunteerPositionsQuery.data!,
    },

    common: {
      footer: footerQuery.data!,
      header: headerQuery.data!,
      images: imagesQuery.data!,
      keywords: keywordsQuery.data!,
      linkLabels: linkLabelsQuery.data!,
      orgDetails: orgDetailsQuery.data!,
    },
  });
};

const PageUserEditProviders = ({
  children,
  dbData,
}: {
  children: ReactElement;
  dbData: PageDbData;
}) => (
  <UedCx.Pages.VolunteerPositions.Provider initData={dbData.page}>
    <UedCx.VolunteerPositions.Provider initData={dbData.volunteerPositions}>
      {children}
    </UedCx.VolunteerPositions.Provider>
  </UedCx.Pages.VolunteerPositions.Provider>
);

const UserEditProviders = ({
  dbData,
  children,
}: {
  dbData: DbData;
  children: ReactElement;
}) => (
  <CommonData.UserEditProviders dbData={dbData.common}>
    <PageUserEditProviders dbData={dbData.page}>
      {children}
    </PageUserEditProviders>
  </CommonData.UserEditProviders>
);
