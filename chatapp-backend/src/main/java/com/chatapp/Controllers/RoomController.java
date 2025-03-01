package com.chatapp.Controllers;


import com.chatapp.Repositories.RoomRepository;
import com.chatapp.entities.Message;
import com.chatapp.entities.Room;
import com.chatapp.entities.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/api/v2/rooms")


public class RoomController {

    private RoomRepository roomrepository;

    public RoomController(RoomRepository roomrepository) {
        this.roomrepository = roomrepository;
    }

//    create room


    @PostMapping
    public ResponseEntity<?> createroom(@RequestBody String roomId) {

        if (roomrepository.findByRoomId(roomId) != null) {
            return ResponseEntity.badRequest().body("Room already exists!!");
        }

        Room room = new Room();
        room.setRoomId(roomId);


        Room savedRoom = roomrepository.save(room);
        return ResponseEntity.status(HttpStatus.CREATED).body(room);

    }

    //    get room
    @GetMapping("/{roomId}")
    public ResponseEntity<?> joinRoom(@PathVariable String roomId) {
        Room room = roomrepository.findByRoomId(roomId);
        if (room == null) {
            return ResponseEntity.badRequest().body("Room not found!!");
        }
        return ResponseEntity.ok(room);
    }


    @DeleteMapping("/{roomId}")
    public ResponseEntity<?> deleteRoomById(@PathVariable String roomId){
        Room room=roomrepository.findByRoomId(roomId);
        if(room==null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        roomrepository.delete(room);
        return new ResponseEntity<>(HttpStatus.OK);

    }


    //    get messages of a room
    @GetMapping("{roomId}/messages")
    public ResponseEntity<?> getmessages(@PathVariable String roomId,
                                         @RequestParam(value = "page", defaultValue = "0", required = false) int page,
                                         @RequestParam(value = "size", defaultValue = "20", required = true) int size) {

        Room room = roomrepository.findByRoomId(roomId);
        if (room == null) {
            return ResponseEntity.badRequest().build();
        }
        List<Message> messages = room.getMessages();
        int start = Math.max(0, messages.size() - (page + 1) * size);
        int end = Math.min(messages.size(), start + size);
        List<Message> paginatedMsgs = messages.subList(start, end);
        return ResponseEntity.ok(messages);
    }




    @PostMapping("{roomId}/users")
    public ResponseEntity<?> addUserToRoom(@PathVariable String roomId, @RequestParam("userId") String userId, @RequestParam("userName") String userName) {
            Room room=roomrepository.findByRoomId(roomId);
            if(room!=null){
            User newUser = new User();
            newUser.setUserId(userId);
            newUser.setUserName(userName);

            // Check if user already exists
            boolean exists = room.getUsers().stream().anyMatch(user -> user.getUserId().equals(userId));
            if (!exists) {
                room.getUsers().add(newUser);
                roomrepository.save(room);
                return ResponseEntity.ok().body("User added successfully!");
            } else {
                return  ResponseEntity.badRequest().body("User already exists in the room!");
            }
        } else {
            return ResponseEntity.badRequest().body("Room not found!");
        }
    }



    // Get users in a room
    @GetMapping("{roomId}/users")
    public List<User> getUsersInRoom(@PathVariable String roomId) {
        Room room = roomrepository.findByRoomId(roomId);
            return room.getUsers().stream().toList(); // Return the list of users in the room
    }



    @DeleteMapping("{roomId}/users/{userId}")
    public ResponseEntity<?>removeUserfromRoom(@PathVariable String roomId,@PathVariable String userId){
        Room room=roomrepository.findByRoomId(roomId);
        room.getUsers().removeIf(user -> user.getUserId().equals(userId));
        roomrepository.save(room);
        return new ResponseEntity<>(room.getUsers(),HttpStatus.OK);

    }
}



