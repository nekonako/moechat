package app

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/nekonako/moechat/app/user"
	"github.com/nekonako/moechat/app/user/events/ws"
)

func Run() {
	app := fiber.New()
	db := DbConn()
	hub := ws.NewHub()
	go hub.Run()

	app.Use(cors.New())
	app.Use(logger.New())
	app.Use(recover.New())

	user.Init(app, db)

	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON("hello internet")
	})

	app.Listen(":3005")

}
