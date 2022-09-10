import Database from '../database';
import Friend from '../database/entities/Friend';
import { UploadedFile } from 'express-fileupload';

class FriendsService {
  friendsDbInstance: Database<typeof Friend>;

  constructor() {
    this.friendsDbInstance = new Database('friends', Friend);
  }

  getFriend = (id: number) => {
    const friendData = this.friendsDbInstance.get(id);
    if (!friendData) throw new Error(`Friend with id ${id} not exist`);
    return {
      name: friendData.name,
      phone: friendData.phone,
      avatar: `data:${friendData.avatarMimeType};base64,${friendData.avatarData}`,
    };
  };

  addFriend = ({
    name,
    phone,
    avatar,
  }: {
    name: string;
    phone: number;
    avatar: UploadedFile;
  }) => {
    this.friendsDbInstance.add({
      avatarData: avatar.data.toString('base64'),
      avatarMimeType: avatar.mimetype,
      name,
      phone,
    });
  };

  deleteFriend(id: number) {
    this.friendsDbInstance.delete(id);
  }
}

export default FriendsService;
