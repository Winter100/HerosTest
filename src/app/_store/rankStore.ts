import { create } from "zustand";
import { toast } from "react-toastify";

import { setLocalStoreageRankTitle } from "../_utils/localStorage";
import { TitleType } from "../_type/RankTitleListType";
import { initialTitleList } from "../_constant/rankTitleList";

type State = {
  rankTitleList: { stat_name: string; isView: boolean }[];
  // selectedRankTitle: string | null;
  selectedRankTitle: { titleName: string; ascending: boolean } | null;
};

type Action = {
  toggleView: (title: string) => void;
  setInitialTitleList: (titleList: TitleType[]) => void;
  setDropTitleList: (start: number, end: number) => void;
  setSeletRankTitle: (title: string | null) => void;
};

// 로컬스토리지로 아래 내역 저장하기
export const useRankStore = create<State & Action>((set) => {
  return {
    rankTitleList: [],
    selectedRankTitle: null,
    toggleView: (title: string) =>
      set((state) => {
        if (title === "이름") {
          toast.error("이름은 필수값 입니다.");
          return { rankTitleList: state.rankTitleList };
        }
        const updatedRankTitleList = state.rankTitleList
          .map((item) =>
            item.stat_name === title ? { ...item, isView: !item.isView } : item,
          )
          .sort((a, b) => (a.isView === b.isView ? 0 : a.isView ? -1 : 1));
        setLocalStoreageRankTitle("RankTitleList", updatedRankTitleList);

        return { rankTitleList: updatedRankTitleList };
      }),
    setInitialTitleList: (titleList) => {
      set(() => {
        if (titleList?.some((i) => i.isView === true)) {
          return { rankTitleList: titleList };
        } else {
          return { rankTitleList: initialTitleList };
        }
      });
    },
    setDropTitleList: (start: number, end: number) =>
      set((state) => {
        const updatedRankTitleList = [...state.rankTitleList];
        const [movedItem] = updatedRankTitleList.splice(start, 1);
        updatedRankTitleList.splice(end, 0, movedItem);
        setLocalStoreageRankTitle("RankTitleList", updatedRankTitleList);

        return { rankTitleList: updatedRankTitleList };
      }),
    setSeletRankTitle: (title: string | null) => {
      set((state) => {
        if (title === null) {
          return {
            selectedRankTitle: null,
          };
        }
        const ascending =
          state.selectedRankTitle?.titleName === title
            ? !state.selectedRankTitle?.ascending
            : false;
        return {
          selectedRankTitle: { titleName: title, ascending: ascending },
        };
      });
    },
  };
});
