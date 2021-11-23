package login

import (
	"context"
	"database/sql"
	"fmt"
	"log"

	"github.com/nekonako/moechat/app/helper"
	"github.com/nekonako/moechat/model/entity"
)

func Repository(ctx context.Context, tx *sql.Tx, username string) (*entity.User, error) {

	//	fmt.Println(username)
	query := "SELECT * FROM users WHERE username = $1"
	rows, err := tx.QueryContext(ctx, query, username)

	helper.PanicErr(err)

	var user entity.User

	defer rows.Close()
	for rows.Next() {
		err := rows.Scan(&user.Id, &user.Username, &user.Password, &user.Email, &user.Image)
		if err != nil {
			fmt.Println(err)
			return new(entity.User), err
		}
		log.Print(user)
	}
	return &user, nil

}
