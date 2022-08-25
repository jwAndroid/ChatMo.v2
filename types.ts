export interface UserEntity {
  userId: string;
  createdAt: number;
  status: number;
}

export interface SettingEntity {
  id: number;
  title: string;
}
export interface RoomsEntity {
  roomId: number;
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
}
export interface RoomEntity {
  id: number;
  title: string;
}
