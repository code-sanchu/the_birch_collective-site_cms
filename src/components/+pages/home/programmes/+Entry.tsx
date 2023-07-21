import { produce } from "immer";
import React, { type ReactNode } from "react";
import { TextAreaForm, TextInputForm } from "~/components/forms";
import { Icon } from "~/components/icons";
import { ComponentMenu } from "~/components/menus";
import { ProgrammeCx } from "~/context/entities";
import { LandingCx } from "~/context/entities/landing";
import { useToast } from "~/hooks";
import type { MyDb } from "~/types/database";
import { UserEditableDataCx } from "../_state";
import { RevisionCx } from "../_state/RevisionCx";
import AddProgrammeModal from "./entries/add-programme-modal/+Entry";

const Programmes = () => {
  return (
    <div className="group/programmes">
      <Headings />
      <EntriesSection />
      <div className="mt-xl flex justify-center">
        <GoToPageButton />
      </div>
    </div>
  );
};

export default Programmes;

const Headings = () => {
  const {
    page: { programmes },
  } = UserEditableDataCx.useAllData();

  const {
    page: { programmes: programmesAction },
  } = UserEditableDataCx.useAction();

  const {
    data: { undoKey },
  } = RevisionCx.use();

  return (
    <div className="">
      <div className="text-center font-display text-6xl text-brandOrange">
        <TextInputForm
          localStateValue={programmes.heading}
          onSubmit={({ inputValue }) =>
            programmesAction.heading.update(inputValue)
          }
          input={{
            placeholder: "Heading",
            styles: "font-bold tracking-wide text-center",
          }}
          tooltip="click to edit programmes heading"
          key={undoKey}
        />
      </div>
      <div className="mt-3 text-center font-light xs:mt-4 xs:text-lg sm:mt-6 sm:text-xl lg:text-2xl">
        <TextAreaForm
          localStateValue={programmes.subheading}
          textArea={{
            placeholder: "Subheading",
            styles: "tracking-wide text-center",
          }}
          onSubmit={({ inputValue }) => {
            programmesAction.subheading.update(inputValue);
          }}
          tooltip="Click to edit programmes subheading"
          key={undoKey}
        />
      </div>
    </div>
  );
};

const EntriesSection = () => {
  const {
    page: {
      programmes: { entries },
    },
    programmes,
  } = UserEditableDataCx.useAllData();

  const entriesSorted = React.useMemo(() => {
    const sorted = produce(entries, (draft) => {
      draft.sort((entryA, entryB) => {
        const programmeA = programmes.find(
          (programme) => programme.id === entryA.dbConnections.programmeId,
        );
        const programmeB = programmes.find(
          (programme) => programme.id === entryB.dbConnections.programmeId,
        );

        if (!programmeA && !programmeB) {
          return 0;
        }
        if (!programmeA) {
          return -1;
        }
        if (!programmeB) {
          return 1;
        }
        return programmeA.index - programmeB.index;
      });
    });
    return sorted;
  }, [entries, programmes]);

  return (
    <div className="mt-md">
      <div className="flex items-center justify-between rounded-md border border-dashed px-4 py-2">
        <AddProgrammeModal
          button={({ openModal }) => (
            <div
              className="my-btn my-btn-neutral flex cursor-pointer items-center gap-xs rounded-sm border-transparent"
              onClick={openModal}
            >
              <span className="text-gray-400">
                <Icon.Create />
              </span>
              <span className="">Add programme</span>
            </div>
          )}
        />

        <div className="flex items-center gap-xs text-sm text-gray-400">
          <span className="text-gray-400">
            <Icon.Info />
          </span>
          <span>
            Each field below is editable. Edit in depth from the programmes
            page.
          </span>
        </div>
      </div>

      {!entries.length ? (
        <div className="mt-md text-gray-800">
          No programmes added to landing page yet.
        </div>
      ) : (
        <div className="mt-lg grid grid-cols-2 gap-sm">
          {entriesSorted.map((programme) => (
            <LandingCx.Programme.Provider
              programme={programme}
              key={programme.id}
            >
              <GetProgrammeWrapper>
                {({ connectedProgramme }) => (
                  <ProgrammeCx.Provider programme={connectedProgramme}>
                    <Programme />
                  </ProgrammeCx.Provider>
                )}
              </GetProgrammeWrapper>
            </LandingCx.Programme.Provider>
          ))}
        </div>
      )}
    </div>
  );
};

const GetProgrammeWrapper = ({
  children,
}: {
  children: (arg0: { connectedProgramme: MyDb["programme"] }) => ReactNode;
}) => {
  const landingProgramme = LandingCx.Programme.use();
  const { programmes } = UserEditableDataCx.useAllData();

  const connectedProgramme = programmes.find(
    (programme) => programme.id === landingProgramme.dbConnections.programmeId,
  );

  if (!connectedProgramme) {
    return <UnfoundProgramme />;
  }

  return children({ connectedProgramme });
};

const UnfoundProgramme = () => (
  <div className="group/programme relative grid place-items-center rounded-md border-2 border-my-alert-content bg-gray-50 p-md">
    <ProgrammeMenu />
    <div className="grid place-items-center">
      <div className="text-5xl text-gray-500">
        <Icon.Programme weight="light" />
      </div>
      <div className="mt-4 text-center text-my-alert-content">
        <p className="mt-1">Error - could not find programme.</p>
      </div>
      <div className="mt-4 max-w-[400px] text-center text-gray-500">
        A programme was added to the landing page that can&apos;t be found. It
        may have been deleted.
      </div>
    </div>
  </div>
);

const Programme = () => {
  const { id, title, subtitle, summary } = ProgrammeCx.use();
  const { programme: programmeAction } = UserEditableDataCx.useAction();

  const {
    data: { undoKey },
  } = RevisionCx.use();

  return (
    <div className="group/programme relative flex flex-col items-center p-sm">
      <ProgrammeMenu />
      <div className="w-full text-center font-display text-3xl font-bold uppercase tracking-wider text-brandLightOrange">
        <TextInputForm
          localStateValue={title}
          onSubmit={({ inputValue }) =>
            programmeAction.title.update({ id, newVal: inputValue })
          }
          input={{
            placeholder: "Title",
            styles: "uppercase tracking-wider text-center",
          }}
          tooltip="Click to edit title"
          key={undoKey}
        />
      </div>
      <div className="mt-xs uppercase text-display xs:text-lg lg:text-xl">
        <TextInputForm
          localStateValue={subtitle}
          onSubmit={({ inputValue }) =>
            programmeAction.subtitle.update({ id, newVal: inputValue })
          }
          input={{ placeholder: "Subtitle", styles: "uppercase" }}
          tooltip="Click to edit subtitle"
          key={undoKey}
        />
      </div>
      <div className="mt-xs w-full text-center text-base font-light xs:font-normal lg:text-lg">
        <TextAreaForm
          localStateValue={summary}
          textArea={{
            placeholder: "Programme summary",
            styles: "text-center",
          }}
          onSubmit={({ inputValue }) => {
            programmeAction.summary.update({ id, newVal: inputValue });
          }}
          tooltip="Click to edit summary"
          key={undoKey}
        />
      </div>
    </div>
  );
};

const ProgrammeMenu = () => {
  const {
    page: {
      programmes: {
        entry: { remove },
      },
    },
  } = UserEditableDataCx.useAction();

  const { id } = LandingCx.Programme.use();

  const toast = useToast();

  return (
    <ComponentMenu styles="right-1 top-1 group-hover/programme:opacity-40">
      <ComponentMenu.Button
        onClick={() => {
          remove({ id });
          toast.neutral("programme removed from landing");
        }}
        tooltip="remove programme from landing"
        styles={{ button: "hover:text-my-alert-content hover:bg-my-alert" }}
      >
        <Icon.Remove weight="bold" />
      </ComponentMenu.Button>
    </ComponentMenu>
  );
};

const GoToPageButton = () => {
  const {
    page: {
      programmes: { buttonText },
    },
  } = UserEditableDataCx.useAllData();

  const {
    page: { programmes: programmesAction },
  } = UserEditableDataCx.useAction();

  const {
    data: { undoKey },
  } = RevisionCx.use();

  return (
    <div
      className="flex cursor-pointer items-center gap-sm rounded-sm bg-brandOrange
    px-4 py-2 text-lg font-bold uppercase tracking-wide text-white sm:gap-2 sm:px-5 sm:py-3 sm:text-xl
    "
    >
      <TextInputForm
        localStateValue={buttonText}
        onSubmit={({ inputValue }) =>
          programmesAction.buttonText.update(inputValue)
        }
        input={{ placeholder: "Button text", styles: "uppercase" }}
        tooltip="Click to edit button text"
        key={undoKey}
      />
      <div className="">
        <Icon.ArrowRight />
      </div>
    </div>
  );
};
