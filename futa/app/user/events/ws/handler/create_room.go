package handler

import (
	"github.com/gofiber/fiber/v2"
	"github.com/nekonako/moechat/app/user/events/ws"
)

type MyRoom struct {
	RoomName string
	RoomId   string
}

func CreateRoom(c *fiber.Ctx, h *ws.Hub) error {

	room := new(MyRoom)

	if err := c.BodyParser(room); err != nil {
		panic(err)
	}

	h.Rooms[room.RoomId] = &ws.Room{
		RoomId:   room.RoomId,
		RoomName: room.RoomName,
		Clients:  make(map[string]*ws.Client),
	}

	return c.JSON(room)

}
