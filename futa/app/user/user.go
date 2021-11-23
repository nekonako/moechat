package user

import (
	"database/sql"

	"github.com/gofiber/fiber/v2"

	"github.com/nekonako/moechat/app/middleware"
	"github.com/nekonako/moechat/app/user/events/login"
	"github.com/nekonako/moechat/app/user/events/register"
	"github.com/nekonako/moechat/app/user/events/ws"
	"github.com/nekonako/moechat/app/user/events/ws/handler"
)

func Init(app *fiber.App, db *sql.DB) {

	hub := ws.NewHub()
	go hub.Run()

	app.Get("/ws/rooms/:roomId", func(c *fiber.Ctx) error {
		return handler.GetClientInRoom(c, hub)
	})

	app.Get("/ws/:roomId", handler.JoinRoom(hub))

	app.Post("/register", func(c *fiber.Ctx) error {
		return register.Handler(c, db)
	})

	app.Post("/login", func(c *fiber.Ctx) error {
		return login.Handler(c, db)
	})

	app.Post("/ws", middleware.JWTAuth, func(c *fiber.Ctx) error {
		return handler.CreateRoom(c, hub)
	})

	app.Get("/ws", func(c *fiber.Ctx) error {
		return handler.GetAvailableRooms(c, hub)
	})

}
