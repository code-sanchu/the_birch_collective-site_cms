import { createContext, useContext, type ReactNode } from "react";
import { useMutation } from "react-query";

import { UedCx } from "~/context/user-editable-data";
import { useLeavePageConfirm, useToast } from "~/hooks";
import { myDb } from "~/my-firebase/firestore";

type ContextValue = {
  data: {
    isChange: boolean;
  };
  actions: {
    save: () => void;
    undo: () => void;
  };
};

const Context = createContext<ContextValue | null>(null);

function Provider({
  children,
}: {
  children: ReactNode | ((args: ContextValue) => ReactNode);
}) {
  const { revision: images } = UedCx.Images.use();
  const { revision: keywords } = UedCx.Keywords.use();

  const revisionDataArr = [images, keywords];

  const isChange = Boolean(revisionDataArr.find((data) => data.isChange));

  useLeavePageConfirm({ runConfirmationOn: isChange });

  const ifChange = (arg0: () => void) => {
    if (!isChange) {
      return;
    }
    arg0();
  };

  const saveMutation = useMutation(myDb.transactions.pages.images);

  const toast = useToast();

  const save = () =>
    ifChange(() =>
      toast.promise(
        () =>
          saveMutation.mutateAsync(
            {
              images: {
                updated: images.saveData.updated,
              },
              keywords: keywords.saveData,
            },
            {
              onSuccess() {
                revisionDataArr.forEach((data) => data.onSaveSuccess());
              },
            },
          ),
        {
          pending: "saving",
          error: "save error",
          success: "saved",
        },
      ),
    );

  const undo = () =>
    ifChange(() => {
      revisionDataArr.forEach((data) => data.handleUndo());

      toast.neutral("undone");
    });

  const value: ContextValue = {
    actions: { undo, save },
    data: {
      isChange,
    },
  };

  return (
    <Context.Provider value={value}>
      {typeof children === "function" ? children(value) : children}
    </Context.Provider>
  );
}

// should use zod for instead of checkObjectHasField?
const useThisContext = () => {
  const context = useContext(Context);

  if (!context) {
    throw new Error("RevisionContext.use must be used within its provider!");
  }

  return context;
};

function RevisionCx() {
  throw new Error(
    "RevisionCx exists for naming purposes only and should not be used as a component",
  );
}

export { RevisionCx };

RevisionCx.Provider = Provider;
RevisionCx.use = useThisContext;
