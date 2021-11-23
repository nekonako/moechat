package api

type RegisterRequest struct {
	Username string `json:"username" db:"username"`
	Password string `json:"password" db:"password"`
	Email    string `json:"email" db:"email"`
	Image    string `json:"image" db:"image"`
}
