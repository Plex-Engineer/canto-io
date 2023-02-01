import create from "zustand";

interface AlertProps {
  id: string;
  type: "Success" | "Failure" | "Warning" | "None";
  floating: boolean;
  show: (
    type: "Success" | "Failure" | "Warning",
    child: React.ReactNode,
    floating?: boolean,
    closeAfter?: number
  ) => void;
  child: React.ReactNode;
  open: boolean;
  close: () => void;
}

export const useAlert = create<AlertProps>((set) => ({
  id: "1",
  type: "None",
  floating: true,
  show: (type, child, floating, closeAfter) => {
    if (type == "Success" && closeAfter != undefined) {
      setTimeout(() => set({ open: false, floating }), closeAfter);
    }
    return set({ type, child, open: true, floating: true });
  },
  open: false,
  child: null,
  close: () => set({ open: false, type: "None" }),
}));
