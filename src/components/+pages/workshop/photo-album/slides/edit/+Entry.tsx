/* eslint-disable jsx-a11y/alt-text */
import { useMemo, type ReactElement } from "react";

import { ConnectImage } from "~/components/ConnectImage";
import { CustomisableImage } from "~/components/CustomisableImage";
import { DndKit } from "~/components/dnd-kit";
import { Icon } from "~/components/icons";
import { ComponentMenu } from "~/components/menus";
import { ImageUploadAndLibrary } from "~/components/parts/upload-image-and-library";
import { Modal } from "~/components/styled-bases";
import { UserSelectedImageWrapper } from "~/components/UserSelectedImageWrapper";
import { WarningPanel } from "~/components/WarningPanel";

import { DbReadCx } from "~/context/db-data-read-only";
import { UedCx } from "~/context/user-editable-data";
import { deepSortByIndex } from "~/helpers/data/process";
import { getIds } from "~/helpers/data/query";
import { useToast } from "~/hooks";
import { generateUid } from "~/lib/external-packages-rename";

export const EditModal = ({
  button,
}: {
  button: (arg0: { openModal: () => void }) => ReactElement;
}) => (
  <Modal.VisibilityCx.Provider>
    {({ closeModal, isOpen, openModal }) => (
      <>
        {button({ openModal })}

        <Modal.OverlayAndPanelWrapper
          onClickOutside={closeModal}
          isOpen={isOpen}
          panelContent={<Content />}
        />
      </>
    )}
  </Modal.VisibilityCx.Provider>
);

const Content = () => {
  const {
    store: {
      data: {
        photoAlbum: { entries: images },
      },
      actions: {
        photoAlbum: { entries: imageAction },
      },
    },
  } = UedCx.Pages.Workshop.use();

  const { closeModal } = Modal.VisibilityCx.use();

  return (
    <div className="relative flex h-[1000px] max-h-[70vh] w-[90vw] max-w-[1200px] flex-col rounded-2xl bg-white p-6 text-left shadow-xl">
      <div className="flex items-center justify-between border-b border-b-gray-200 pb-sm">
        <h3 className="leading-6">Workshop images</h3>
      </div>
      <div className="mt-sm">
        <ImageUploadAndLibrary.Complete
          menuButton={
            <div
              className={`group my-btn my-btn-neutral flex items-center gap-xs`}
            >
              <span className="text-sm">
                <Icon.Create />
              </span>
              <span className="text-sm font-medium">Add new image</span>
            </div>
          }
          onUploadOrSelect={({ dbImageId }) =>
            imageAction.create({
              id: generateUid(),
              image: {
                dbConnections: { imageId: dbImageId },
              },
              index: images.length,
            })
          }
        />
      </div>
      <div className="mt-sm flex-grow overflow-y-auto">
        <Images />
      </div>
      <div className="mt-xl">
        <button
          className="my-btn my-btn-neutral"
          type="button"
          onClick={closeModal}
        >
          close
        </button>
      </div>
    </div>
  );
};

const Images = () => {
  const {
    store: {
      data: {
        photoAlbum: { entries: images },
      },
      actions: {
        photoAlbum: { entries: imageAction },
      },
    },
  } = UedCx.Pages.Workshop.use();

  const sorted = useMemo(() => deepSortByIndex(images), [images]);

  return (
    <div className="mt-xs">
      {!images.length ? (
        <p className="text-gray-800">No images yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-sm pr-sm">
          <DndKit.Context
            elementIds={getIds(sorted)}
            onReorder={imageAction.reorder}
          >
            {sorted.map((image) => (
              <DndKit.Element
                elementId={image.id}
                styles={{ handle: "bg-white" }}
                key={image.id}
              >
                <DbReadCx.Workshop.PhotoAlbumEntry.Provider infoEntry={image}>
                  <Image />
                </DbReadCx.Workshop.PhotoAlbumEntry.Provider>
              </DndKit.Element>
            ))}
          </DndKit.Context>
        </div>
      )}
    </div>
  );
};

const Image = () => {
  const { image } = DbReadCx.Workshop.PhotoAlbumEntry.use();

  return (
    <div className="group/entry relative aspect-square rounded-lg border p-sm">
      <div className="relative aspect-square">
        <div className=" absolute h-full w-full">
          <UserSelectedImageWrapper
            dbImageId={image.dbConnections.imageId}
            placeholderText="background image"
          >
            {({ dbImageId }) => (
              <ConnectImage connectedImageId={dbImageId}>
                {({ urls }) => (
                  <CustomisableImage urls={urls} objectFit="contain" />
                )}
              </ConnectImage>
            )}
          </UserSelectedImageWrapper>
        </div>
      </div>
      <Menu />
    </div>
  );
};

const Menu = () => {
  const {
    store: {
      actions: {
        photoAlbum: { entries: imageAction },
      },
    },
  } = UedCx.Pages.Workshop.use();

  const { id } = DbReadCx.Workshop.PhotoAlbumEntry.use();

  const toast = useToast();

  return (
    <ComponentMenu styles="left-1 top-1 group-hover/entry:opacity-60">
      <ComponentMenu.Image.UploadAndLibraryModal
        onUploadOrSelect={({ dbImageId }) => {
          imageAction.image.dbConnections.imageId({
            id,
            updatedValue: dbImageId,
          });
        }}
        styles={{
          menu: { itemsWrapper: "right-0 -bottom-1 translate-y-full" },
        }}
      />

      <ComponentMenu.Divider />
      <Modal.WithVisibilityProvider
        button={({ openModal }) => (
          <ComponentMenu.Button.Delete
            onClick={openModal}
            tooltip="delete image"
          />
        )}
        panelContent={({ closeModal }) => (
          <WarningPanel
            callback={() => {
              imageAction.delete({ id });
              closeModal();
              toast.neutral("deleted image");
            }}
            closeModal={closeModal}
            text={{
              title: "Delete image",
              body: "Are you sure?",
            }}
          />
        )}
      />
    </ComponentMenu>
  );
};
