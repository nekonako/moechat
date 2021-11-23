package register

import (
	"context"
	"database/sql"

	"github.com/nekonako/moechat/model/entity"
)

func Repository(ctx context.Context, tx *sql.Tx, user entity.User) (*entity.User, error) {

	var lastInsertId int
	query := "INSERT INTO users(username, password, email, image) VALUES($1, $2, $3, $4) returning id"
	err := tx.QueryRowContext(ctx, query, user.Username, user.Password, user.Email, user.Image).Scan(&lastInsertId)

	if err != nil {
		return &entity.User{}, err
	}

	user.Id = lastInsertId
	return &user, nil

}
