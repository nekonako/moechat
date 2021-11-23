package login

import (
	"context"
	"database/sql"
	"fmt"
	"strings"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/nekonako/moechat/app/config"
	"github.com/nekonako/moechat/app/helper"
	"github.com/nekonako/moechat/model/api"
	"golang.org/x/crypto/bcrypt"
)

type MyJwtClaims struct {
	jwt.StandardClaims
	Username string `json:"username"`
	Email    string `json:"email"`
	Id       int    `json:"id"`
}

var (
	APP_NAME                 = "Moechat"
	JWT_SIGNING_METHOD       = jwt.SigningMethodHS256
	JWT_ACESS_TOKEN_EXPIRED  = time.Duration(1) * time.Hour
	JWT_ACCESS_TOKEN_EXPIRED = time.Duration(30) * (time.Hour * 24)
)

func Service(ctx context.Context, db *sql.DB, request api.LoginRequest) *api.LoginResponse {

	tx, err := db.Begin()
	helper.PanicErr(err)
	defer helper.RollbackErr(tx)

	//fmt.Println(request)

	var baseResponse api.BaseResponse
	result, errQuery := Repository(ctx, tx, request.Username)

	if errQuery != nil {

		if strings.Contains(errQuery.Error(), "found") {

			baseResponse = api.BaseResponse{
				Success: false,
				Code:    401,
				Message: errQuery.Error(),
			}

			return &api.LoginResponse{
				BaseResponse: &baseResponse,
			}
		}

		baseResponse = api.BaseResponse{
			Success: false,
			Code:    401,
			Message: "error when query to database",
		}

		return &api.LoginResponse{
			BaseResponse: &baseResponse,
		}

	}

	fmt.Println(result.Password)
	errComparePass := bcrypt.CompareHashAndPassword([]byte(result.Password), []byte(request.Password))
	if errComparePass != nil {
		fmt.Println(result.Password)
		return &api.LoginResponse{
			BaseResponse: &api.BaseResponse{
				Success: false,
				Code:    401,
				Message: "Password are invalid",
			},
		}
	}

	baseResponse = api.BaseResponse{
		Success: true,
		Code:    200,
		Message: "Login is success",
	}

	accessTokenClaims := MyJwtClaims{
		StandardClaims: jwt.StandardClaims{
			Issuer:    APP_NAME,
			ExpiresAt: time.Now().Add(JWT_ACCESS_TOKEN_EXPIRED).Unix(),
		},
		Username: result.Username,
		Email:    result.Email,
		Id:       result.Id,
	}

	refreshTokenClaims := MyJwtClaims{
		StandardClaims: jwt.StandardClaims{
			Issuer:    APP_NAME,
			ExpiresAt: time.Now().Add(JWT_ACCESS_TOKEN_EXPIRED).Unix(),
		},
		Username: result.Username,
		Email:    result.Email,
		Id:       result.Id,
	}

	accessToken := jwt.NewWithClaims(JWT_SIGNING_METHOD, accessTokenClaims)
	refreshToken := jwt.NewWithClaims(JWT_SIGNING_METHOD, refreshTokenClaims)

	config, errConfig := config.LoadConfig()
	if errConfig != nil {
		return &api.LoginResponse{
			BaseResponse: &api.BaseResponse{
				Success: false,
				Code:    401,
				Message: err.Error(),
			},
		}
	}

	signedAccessToken, errSignedToken := accessToken.SignedString([]byte(config.JwtSecretKey))
	signedrefreshToken, errSignedToken := refreshToken.SignedString([]byte(config.JwtSecretKey))

	if errSignedToken != nil {
		fmt.Println(errSignedToken)
		panic(errSignedToken)
	}

	return &api.LoginResponse{
		BaseResponse: &baseResponse,
		Data: &api.LoginResponseData{
			AccessToken:  signedAccessToken,
			RefreshToken: signedrefreshToken,
		},
	}

}
