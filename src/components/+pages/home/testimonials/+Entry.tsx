import { CustomisableImage } from "~/components/CustomisableImage";
import { DbImageWrapper } from "~/components/DbImageWrapper";
import { ImagePlaceholder } from "~/components/ImagePlaceholder";
import { UserSelectedImageWrapper } from "~/components/UserSelectedImageWrapper";
import { Icon } from "~/components/icons";
import { deepSortByIndex } from "~/helpers/data/process";
import { useHovered } from "~/hooks";
import type { MyDb } from "~/types/database";
import { UserEditableDataCx } from "../_state";
import { EditModal } from "./edit/+Entry";
import { Slides } from "./slides/+Entry";

// □ testimonial endorser name not saving (seems updating okay)
// □ max width. move nav buttons to right.
// □ will probably need to reset mydb.testimonials order at points

const Testimonials = () => {
  const { testimonials } = UserEditableDataCx.useAllData();

  const slidesInitData = [
    ...deepSortByIndex(testimonials),
    ...(Array(testimonials.length >= 4 ? 0 : 4 - testimonials.length).fill(
      "dummy",
    ) as "dummy"[]),
  ];

  return (
    <div className="">
      <div className="flex items-center justify-between rounded-md border border-dashed px-4 py-2">
        <EditModal
          button={({ openModal }) => (
            <div
              className="my-btn my-btn-neutral flex cursor-pointer items-center gap-xs rounded-sm border-transparent"
              onClick={openModal}
            >
              <span className="text-gray-400">
                <Icon.Configure />
              </span>
              <span className="">Edit testimonials</span>
            </div>
          )}
        />
      </div>
      <Slides
        numSlidesTotal={testimonials.length}
        slides={({ leftMost, rightMost }) =>
          slidesInitData.map((landingData, i) => (
            <Testimonial
              slidesView={{ isFirst: i === leftMost, isLast: i === rightMost }}
              testimonial={landingData}
              key={i}
            />
          ))
        }
      />
    </div>
  );
};

export default Testimonials;

const Testimonial = ({
  testimonial,
  slidesView,
}: {
  slidesView: {
    isFirst?: boolean;
    isLast?: boolean;
  };
  testimonial: MyDb["testimonial"] | "dummy";
}) => {
  const [isHovered, { hoverHandlers }] = useHovered();

  return (
    <div
      className={`relative aspect-[3/4] border-2 border-white transition-transform duration-[275ms] ease-[cubic-bezier(0.24,0.26,0.2,1)] ${
        isHovered ? "md:scale-115" : "scale-100"
      } ${
        slidesView.isFirst
          ? "origin-left"
          : slidesView.isLast
          ? "origin-right"
          : ""
      }`}
      {...hoverHandlers}
    >
      {testimonial === "dummy" ? (
        <TestimonialDummy />
      ) : (
        <TestimonialActual data={testimonial} />
      )}
    </div>
  );
};

const TestimonialDummy = () => (
  <>
    <div className="absolute h-full w-full">
      <ImagePlaceholder placeholderText="" />
    </div>
    <div className="absolute bottom-0 z-10 flex h-4/5 w-full flex-col justify-end gap-sm rounded-b-md bg-gradient-to-t from-black to-transparent p-sm text-center text-lg text-white">
      <div className="overflow-auto scrollbar-hide">
        <p className="">
          Herald sad and trumpet be, To this troop come thou not near! To
          themselves yet either neither, Beauty brag, but tis not she; If what
          parts can so remain...
        </p>
      </div>
      <div className="shrink-0 font-medium">
        <p>Person Name</p>
      </div>
    </div>
  </>
);

const TestimonialActual = ({ data }: { data: MyDb["testimonial"] }) => {
  return (
    <>
      <div className=" absolute h-full w-full">
        <UserSelectedImageWrapper
          dbImageId={data.image.dbConnect.imageId}
          placeholderText="background image"
        >
          {({ dbImageId }) => (
            <DbImageWrapper dbImageId={dbImageId}>
              {({ urls }) => (
                <CustomisableImage urls={urls} position={data.image.position} />
              )}
            </DbImageWrapper>
          )}
        </UserSelectedImageWrapper>
      </div>
      <div className="absolute bottom-0 z-10 flex h-4/5 w-full flex-col justify-end gap-sm rounded-b-md bg-gradient-to-t from-black to-transparent p-sm text-center text-lg text-white">
        <div className="overflow-auto scrollbar-hide">
          {data.text.length ? data.text : "Testimonial"}
        </div>
        <div className="shrink-0 font-medium">
          <p>
            {data.endorserName.length ? data.endorserName : "Endorser name"}
          </p>
        </div>
      </div>
    </>
  );
};
