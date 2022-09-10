import BaseEntity from './BaseEntity';

export interface IFriend {
  name: string;
  avatarData: string;
  avatarMimeType: string;
  phone: number;
}

class Friend extends BaseEntity implements IFriend {
  name!: string;

  avatarData!: string;

  avatarMimeType!: string;

  phone!: number;
}

export default Friend;
