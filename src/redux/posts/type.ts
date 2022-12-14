export interface ChipEntity {
  id: string;
  title: string;
}
export interface RoomEntity {
  roomId: string;
  title: string;
  lastMemo: string | null;
  memoCount: number | null;
  isFavorites: boolean;
  isCompleate: boolean | null;
  isLock: boolean;
  password: string | null;
  createdAt: number;
  updatedAt: number;
  modifyAt: number | null;
  chips: ChipEntity[] | null;
}
