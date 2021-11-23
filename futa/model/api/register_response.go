package api

type RegisterResponseData struct {
	Id       int    `json:"id" db:"id"`
	Username string `json:"username" db:"username"`
	Email    string `json:"email" db:"email"`
	Image    string `json:"image" db:"image"`
}

type RegisterResponse struct {
	*BaseResponse
	Data *RegisterResponseData `json:"data"`
}
