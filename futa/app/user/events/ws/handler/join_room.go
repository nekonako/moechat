package handler

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
	"github.com/nekonako/moechat/app/user/events/ws"
)

func JoinRoom(h *ws.Hub) fiber.Handler {
	return websocket.New(func(c *websocket.Conn) {

		roomId := c.Params("roomId")
		clientId := c.Query("userId")
		username := c.Query("username")

		fmt.Println(roomId, clientId)

		client := &ws.Client{
			Username: username,
			Conn:     c,
			RoomId:   roomId,
			ClientId: clientId,
			Message:  make(chan *ws.Message, 10),
		}

		m := ws.Message{
			Message:  "newuser",
			ClientId: client.ClientId,
			RoomId:   client.RoomId,
			Username: username,
		}

		h.Register <- client
		h.Broadcast <- &m

		go client.WriteMessage()
		client.ReadMessage(h)

	})
}
