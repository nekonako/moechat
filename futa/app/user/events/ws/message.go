package ws

type Message struct {
	Message  string `json:"message"`
	ClientId string `json:"clientId"`
	RoomId   string `json:"roomId"`
	Username string `json:"username"`
}
