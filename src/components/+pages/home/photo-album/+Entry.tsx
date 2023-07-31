import { TextInputForm } from "~/components/forms";
import { Icon } from "~/components/icons";
import CmsLayout from "~/components/layouts/Cms";
import SiteLayout from "~/components/layouts/Site";
import { UedCx } from "~/context/user-editable-data";
import Slides from "./slides/+Entry";
import { EditModal } from "./slides/edit/+Entry";

const PhotoAlbum = () => (
  <div>
    <SiteLayout.Section.Spacing.Horizontal>
      <CmsLayout.EditBar>
        <EditModal
          button={({ openModal }) => (
            <div
              className="my-btn my-btn-neutral flex cursor-pointer items-center gap-xs rounded-sm border-transparent"
              onClick={openModal}
            >
              <span className="text-gray-400">
                <Icon.Configure />
              </span>
              <span className="">Edit photo album</span>
            </div>
          )}
        />
      </CmsLayout.EditBar>
    </SiteLayout.Section.Spacing.Horizontal>
    <div className="mt-md flex justify-end">
      <div className="w-3/4">
        <Heading />
        <div className="relative aspect-video overflow-visible">
          <Slides />
        </div>
      </div>
    </div>
  </div>
);

export default PhotoAlbum;

const Heading = () => {
  const {
    photoAlbum: { heading },
  } = UedCx.Pages.Landing.useData();

  const { photoAlbum: photoAlbumAction } = UedCx.Pages.Landing.useAction();

  return (
    <div className="flex items-center justify-end gap-xs">
      <TextInputForm
        localStateValue={heading}
        onSubmit={photoAlbumAction.heading}
        input={{ placeholder: "Photo album heading", styles: "uppercase" }}
        tooltip="Click to edit heading"
      />
      <Icon.ArrowRight />
    </div>
  );
};
