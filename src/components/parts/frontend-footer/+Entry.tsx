import { Popover } from "@headlessui/react";
import type { ReactElement } from "react";

import { CustomisableImage } from "~/components/CustomisableImage";
import { DbImageWrapper } from "~/components/DbImageWrapper";
import { UserEditableDataCx } from "~/components/+pages/home/_state";
import TextInputPopoverPanel from "~/components/TextInputPopoverPanel";
import { TextAreaForm, TextInputForm } from "~/components/forms";
import { Icon } from "~/components/icons";

import livingWageLogo from "public/images/living-wage-logo.webp";
import { NextImage } from "~/lib/external-packages-rename";
import { RevisionCx } from "~/components/+pages/home/_state/RevisionCx";
import { UserSelectedImageWrapper } from "~/components/UserSelectedImageWrapper";
import { ComponentMenu } from "~/components/menus";
import { WithTooltip } from "~/components/WithTooltip";

// todo: block phone number + email through other means

const FrontendFooter = () => {
  return (
    <div className="flex items-center gap-xl">
      <div className="flex-grow">
        <SocialMediaLinks />
        <div className="mt-md">
          <PageLinks />
        </div>
        <div className="mt-md">
          <InfoRow />
        </div>
        <div className="mt-md">
          <BottomRow />
        </div>
      </div>
      <SecondColumn />
    </div>
  );
};

export default FrontendFooter;

const SocialMediaLinks = () => {
  const {
    orgDetails: { socialMediaLinks },
  } = UserEditableDataCx.useAllData();

  const {
    orgDetails: { socialMediaLinks: socialMediaLinksAction },
  } = UserEditableDataCx.useAction();

  return (
    <div className="flex items-center gap-lg">
      <SocialMediaLink
        icon={<Icon.Facebook color="#3b5998" />}
        panelContent={
          <TextInputPopoverPanel
            input={
              <TextInputForm
                localStateValue={socialMediaLinks.facebook}
                onSubmit={({ inputValue }) =>
                  socialMediaLinksAction.facebook.update(inputValue)
                }
                input={{ placeholder: "Enter facebook link", autoFocus: true }}
                tooltip="Click to update facebook link"
              />
            }
            title="Facebook link"
          />
        }
      />

      <SocialMediaLink
        icon={<Icon.Instagram color="#833AB4" />}
        panelContent={
          <TextInputPopoverPanel
            input={
              <TextInputForm
                localStateValue={socialMediaLinks.instagram}
                onSubmit={({ inputValue }) =>
                  socialMediaLinksAction.instagram.update(inputValue)
                }
                input={{ placeholder: "Enter instagram link", autoFocus: true }}
                tooltip="Click to update instagram link"
              />
            }
            title="Instagram link"
          />
        }
      />

      <SocialMediaLink
        icon={<Icon.Linkedin color="#0e76a8" />}
        panelContent={
          <TextInputPopoverPanel
            input={
              <TextInputForm
                localStateValue={socialMediaLinks.linkedIn}
                onSubmit={({ inputValue }) =>
                  socialMediaLinksAction.linkedIn.update(inputValue)
                }
                input={{ placeholder: "Enter linkedIn link", autoFocus: true }}
                tooltip="Click to update linkedIn link"
              />
            }
            title="LinkedIn link"
          />
        }
      />
    </div>
  );
};

const SocialMediaLink = ({
  icon,
  panelContent,
}: {
  icon: ReactElement;
  panelContent: ReactElement;
}) => (
  <Popover className="relative">
    <Popover.Button>
      <WithTooltip text="Click to edit link">
        <div className="text-3xl">{icon}</div>
      </WithTooltip>
    </Popover.Button>

    <Popover.Panel className={`absolute -top-xs left-0 -translate-y-full`}>
      {panelContent}
    </Popover.Panel>
  </Popover>
);

const PageLinks = () => {
  const {
    linkLabels: { programmes, workshops, donate, volunteer, aboutUs },
  } = UserEditableDataCx.useAllData();

  const { linkLabels: linkLabelsAction } = UserEditableDataCx.useAction();

  return (
    <div className="flex items-center gap-lg">
      <div className="font-medium text-brandGreen">
        <TextInputForm
          localStateValue={programmes}
          onSubmit={({ inputValue }) =>
            linkLabelsAction.programmes.update(inputValue)
          }
          input={{ placeholder: "Programmes link text", styles: "underline" }}
          tooltip="Click to edit programmes link text"
        />
      </div>
      <div className="font-medium text-brandGreen">
        <TextInputForm
          localStateValue={workshops}
          onSubmit={({ inputValue }) =>
            linkLabelsAction.workshops.update(inputValue)
          }
          input={{ placeholder: "Workshops link text", styles: "underline" }}
          tooltip="Click to edit workshops link text"
        />
      </div>
      <div className="font-medium text-brandGreen">
        <TextInputForm
          localStateValue={donate}
          onSubmit={({ inputValue }) =>
            linkLabelsAction.donate.update(inputValue)
          }
          input={{ placeholder: "Donate link text", styles: "underline" }}
          tooltip="Click to edit donate link text"
        />
      </div>
      <div className="font-medium text-brandGreen">
        <TextInputForm
          localStateValue={volunteer}
          onSubmit={({ inputValue }) =>
            linkLabelsAction.volunteer.update(inputValue)
          }
          input={{ placeholder: "Volunteer link text", styles: "underline" }}
          tooltip="Click to edit volunteer link text"
        />
      </div>
      <div className="font-medium text-brandGreen">
        <TextInputForm
          localStateValue={aboutUs}
          onSubmit={({ inputValue }) =>
            linkLabelsAction.aboutUs.update(inputValue)
          }
          input={{ placeholder: "About us link text", styles: "underline" }}
          tooltip="Click to edit about us link text"
        />
      </div>
    </div>
  );
};

const InfoRow = () => {
  const {
    footer: { livingWageEmployer, orgDescription },
  } = UserEditableDataCx.useAllData();

  const { footer: footerAction } = UserEditableDataCx.useAction();

  const {
    data: { undoKey },
  } = RevisionCx.use();

  return (
    <div className="">
      <div className="text-gray-800">
        <TextAreaForm
          localStateValue={orgDescription}
          textArea={{
            placeholder: "Org description (optional)",
          }}
          onSubmit={({ inputValue }) => {
            footerAction.orgDescription.update(inputValue);
          }}
          tooltip="Click to edit org description"
          key={undoKey}
        />
      </div>
      <div className="mt-xxxs text-gray-800">
        <TextAreaForm
          localStateValue={livingWageEmployer.text}
          textArea={{
            placeholder: "Living wage employer text (optional)",
          }}
          onSubmit={({ inputValue }) => {
            footerAction.livingWageEmployer.text.update(inputValue);
          }}
          tooltip="Click to edit living wage employer text"
          key={undoKey}
        />
      </div>
    </div>
  );
};

const SecondColumn = () => {
  const {
    orgDetails: { logoImage },
  } = UserEditableDataCx.useAllData();

  return (
    <div className="flex items-center gap-lg">
      <div className="relative aspect-square w-[100px]">
        <NextImage
          alt=""
          src={livingWageLogo}
          fill
          placeholder="blur"
          style={{
            objectFit: "contain",
          }}
        />
      </div>
      <div className="relative aspect-square w-[70px]">
        <UserSelectedImageWrapper
          dbImageId={logoImage.dbConnections.imageId}
          placeholderText="logo"
        >
          {({ dbImageId }) => (
            <DbImageWrapper dbImageId={dbImageId}>
              {({ urls }) => <CustomisableImage urls={urls} />}
            </DbImageWrapper>
          )}
        </UserSelectedImageWrapper>
        <LogoMenu />
      </div>
    </div>
  );
};

const LogoMenu = () => {
  const {
    orgDetails: { logoImage: logoAction },
  } = UserEditableDataCx.useAction();

  return (
    <ComponentMenu styles="left-1 top-1 group-hover/logo:opacity-40">
      <ComponentMenu.Image.UploadAndLibraryModal
        onUploadOrSelect={({ dbImageId }) => {
          logoAction.dbConnections.imageId.update(dbImageId);
        }}
        styles={{
          menu: { itemsWrapper: "left-0 -bottom-1 translate-y-full" },
        }}
      />
    </ComponentMenu>
  );
};

const BottomRow = () => {
  const {
    orgDetails: { contact },
    footer,
  } = UserEditableDataCx.useAllData();

  const {
    orgDetails: { contact: contactAction },
    footer: footerAction,
  } = UserEditableDataCx.useAction();

  const {
    data: { undoKey },
  } = RevisionCx.use();

  return (
    <div className="flex items-center gap-lg">
      <div className="text-brandGreen">
        <TextInputForm
          localStateValue={contact.phoneNumber}
          onSubmit={({ inputValue }) =>
            contactAction.phoneNumber.update(inputValue)
          }
          input={{ placeholder: "Phone number" }}
          tooltip="Click to edit phone number"
          key={undoKey}
        />
      </div>
      <div className="text-brandGreen">
        <TextInputForm
          localStateValue={contact.email}
          onSubmit={({ inputValue }) => contactAction.email.update(inputValue)}
          input={{ placeholder: "Email" }}
          tooltip="Click to edit email"
          key={undoKey}
        />
      </div>
      <div className="text-brandGreen">
        <TextInputForm
          localStateValue={footer.message}
          onSubmit={({ inputValue }) => footerAction.message.update(inputValue)}
          input={{
            placeholder: "Link to message form text",
          }}
          tooltip="Click to edit link to message form text"
          key={undoKey}
        />
      </div>
    </div>
  );
};
