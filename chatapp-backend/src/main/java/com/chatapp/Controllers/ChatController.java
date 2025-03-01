package com.chatapp.Controllers;

import com.chatapp.Repositories.RoomRepository;
import com.chatapp.entities.PvtMessage;
import com.chatapp.playload.MessageRequest;
import com.chatapp.entities.Message;
import com.chatapp.entities.Room;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import java.time.LocalDateTime;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@Controller
public class ChatController {

        private RoomRepository roomRepository;

        private SimpMessagingTemplate simpMessagingTemplate;

        public ChatController(RoomRepository roomRepository) {
            this.roomRepository = roomRepository;
        }
        //for sending and receiving messages
        @MessageMapping("/sendMessage/{roomId}")// /app/sendMessage/roomId
        @SendTo("/topic/room/{roomId}")//subscribe
        public Message sendMessage(
                @DestinationVariable String roomId,
                @RequestBody MessageRequest request
        ) {
            Room room = roomRepository.findByRoomId(request.getRoomId());
            Message message = new Message();
            message.setContent(request.getContent());
            message.setSender(request.getSender());
            message.setTimeStamp(LocalDateTime.now());

            if (room != null) {
                room.getMessages().add(message);
                roomRepository.save(room);
            } else {
                throw new RuntimeException("room not found !!");
            }

            return message;


        }

//        for private messages from user to user

    @MessageMapping("/private-message")
    public PvtMessage recMessage(@Payload PvtMessage pvtMessage){
        simpMessagingTemplate.convertAndSendToUser(pvtMessage.getRecieverId(),"/private",pvtMessage);
        System.out.println(pvtMessage.toString());
        return pvtMessage;
    }

    }