package com.chatapp.Repositories;

import com.chatapp.entities.Room;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface RoomRepository extends MongoRepository<Room,String>{

    Room findByRoomId(String roomId);


}
