package ws

import "fmt"

type Hub struct {
	Broadcast  chan *Message
	Register   chan *Client
	Unregister chan *Client
	Rooms      map[string]*Room
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.Register:
			fmt.Println("Register client")
			if _, isRoomExist := h.Rooms[client.RoomId]; !isRoomExist {
				h.Rooms[client.RoomId] = &Room{
					RoomId:  client.RoomId,
					Clients: make(map[string]*Client),
				}
			}
			room := h.Rooms[client.RoomId]
			if _, isCLientExist := room.Clients[client.ClientId]; !isCLientExist {
				room.Clients[client.ClientId] = client
			}

		case client := <-h.Unregister:

			if _, isCLientExist := h.Rooms[client.RoomId].Clients[client.ClientId]; isCLientExist {
				fmt.Println("delete connection")
				if len(h.Rooms[client.RoomId].Clients) != 0 {
					h.Broadcast <- &Message{
						Message:  "disconnect_user",
						ClientId: client.ClientId,
						RoomId:   client.RoomId,
						Username: client.Username,
					}
				}
				delete(h.Rooms[client.RoomId].Clients, client.ClientId)
				close(client.Message)
			}

			// remove room if no one clinet
			clients := h.Rooms[client.RoomId].Clients
			if len(clients) == 0 {
				delete(h.Rooms, client.RoomId)
			}

		case message := <-h.Broadcast:
			if _, exist := h.Rooms[message.RoomId]; exist {
				for _, client := range h.Rooms[message.RoomId].Clients {
					if client.RoomId == message.RoomId {
						client.Message <- message
					}
				}

			}
		}
	}
}

func NewHub() *Hub {
	return &Hub{
		Broadcast:  make(chan *Message, 5),
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Rooms:      make(map[string]*Room),
	}
}
