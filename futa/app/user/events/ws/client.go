package ws

import (
	"fmt"
	"strings"

	"github.com/gofiber/websocket/v2"
)

type Client struct {
	Conn     *websocket.Conn
	ClientId string `json:"clientId"`
	Username string `json:"username"`
	RoomId   string `json:"roomId"`
	Message  chan *Message
}

// from webscoket Connections to Hub
func (c *Client) ReadMessage(h *Hub) {
	defer func() {
		h.Unregister <- c
		c.Conn.Close()
	}()

	for {
		_, m, err := c.Conn.ReadMessage()
		if err != nil {
			fmt.Println(err)
			if strings.Contains(err.Error(), "websocket: close") {
				fmt.Println("close Connection")
			}
			break
		}
		mesaage := Message{
			Message:  string(m),
			ClientId: c.ClientId,
			RoomId:   c.RoomId,
			Username: c.Username,
		}
		h.Broadcast <- &mesaage
	}
}

// from Hub to websocket Connection
func (c *Client) WriteMessage() {
	defer func() {
		c.Conn.Close()
	}()
	for {
		select {
		case message, ok := <-c.Message:
			if !ok {
				break
			}
			c.Conn.WriteJSON(message)
		}
	}
}
