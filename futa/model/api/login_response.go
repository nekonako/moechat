package api

type LoginResponseData struct {
	AccessToken  string `json:"accessToken"`
	RefreshToken string `json:"refreshToken"`
}

type LoginResponse struct {
	*BaseResponse
	Data *LoginResponseData `json:"data"`
}
