export interface UserEntity {
  userId: string;
  createdAt: number;
  status: number;
}

export interface SettingEntity {
  id: number;
  title: string;
}

export interface ChipEntity {
  id: string;
  title: string;
}
export interface RoomEntity {
  roomId: string;
  title: string;
  lastMemo: string;
  memoCount: number;
  isFavorites: boolean;
  isCompleate: boolean;
  isPin: boolean;
  isLock: boolean;
  password: number;
  status: number;
  createdAt: number;
  updatedAt: number;
  lastUpdateOn: number;
  chips: ChipEntity[];
}
