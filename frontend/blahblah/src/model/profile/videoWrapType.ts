import { PageableType } from "./pageableType";
import { ProfileVideoType } from "./profileVideoType";

export type VideoWrapType = {
  content: ProfileVideoType[];
  pageable: PageableType;
  last: boolean;
  totalElement: number;
  totalPages: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
};

