export type Programme = {
  id: string;

  index: number;

  bannerImage: {
    dbConnections: {
      imageId: string | null;
    };
    position: {
      x: number;
      y: number;
    };
  };

  info: { id: string; index: number; title: string; text: string }[];

  mainText: string;

  posters: {
    id: string;
    index: number;
    image: {
      dbConnections: {
        imageId: string | null;
      };
    };
  }[];

  sections: {
    id: string;

    index: number;

    bullets: {
      icon:
        | "leaf"
        | "tree"
        | "orange"
        | "potted-plant"
        | "plant"
        | "flower-tulip"
        | "flower-lotus"
        | "feather"
        | "flame"
        | "fish-simple"
        | "mountains"
        | "moon"
        | "grains"
        | "star"
        | "tipi"
        | "sun";

      entries: { id: string; index: number; text: string }[];
    };

    colour: "brown" | "green" | "orange";
  }[];

  subtitle: string;

  summary: {
    bullets: { id: string; index: number; text: string }[];

    image: {
      dbConnections: {
        imageId: string | null;
      };

      position: {
        x: number;
        y: number;
      };
    };

    mainText: string;
  };

  title: string;
};
