package handler

import (
	"github.com/gofiber/fiber/v2"
	"github.com/nekonako/moechat/app/user/events/ws"
	"github.com/nekonako/moechat/model/api"
)

type Res struct {
	*api.BaseResponse
	Data *[]RoomList `json:"data"`
}

type RoomList struct {
	RoomName string `json:"roomName"`
	RoomId   string `json:"roomId"`
}

func GetAvailableRooms(c *fiber.Ctx, h *ws.Hub) error {

	rooms := make([]RoomList, 0)

	for _, room := range h.Rooms {
		rooms = append(rooms, RoomList{
			RoomName: room.RoomName,
			RoomId:   room.RoomId,
		})
	}

	res := Res{
		BaseResponse: &api.BaseResponse{
			Success: true,
			Code:    200,
			Message: "success get rooms",
		},
		Data: &rooms,
	}

	return c.JSON(&res)
}
