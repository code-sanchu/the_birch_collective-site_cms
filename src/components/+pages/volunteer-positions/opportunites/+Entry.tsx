import { TextInputForm } from "~/components/forms";

import Positions from "./positions/+Entry";

import { UedCx } from "~/context/user-editable-data";

const Opportunities = () => (
  <div>
    <Heading />
    <div className="mt-md">
      <Positions />
    </div>
  </div>
);

export default Opportunities;

const Heading = () => {
  const {
    store: {
      data: {
        opportunities: { heading },
      },
      actions: { opportunities: opportunitiesAction },
    },
    revision: { undoKey },
  } = UedCx.Pages.VolunteerPositions.use();

  return (
    <div className="overflow-x-auto text-center font-display text-6xl text-brandOrange">
      <TextInputForm
        localStateValue={heading}
        onSubmit={opportunitiesAction.heading}
        input={{
          placeholder: "Opportunities heading",
          styles: "text-center font-bold",
        }}
        tooltip="Click to edit opportunities heading"
        key={undoKey}
      />
    </div>
  );
};
