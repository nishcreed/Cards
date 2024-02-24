package main

import (
	"errors"
	// "fmt"
	"net/http"
	"github.com/gin-gonic/gin"
)

type leaderboard struct {
	Username string `json:"username"`
	Score    int    `json:"score"`
}

var users = []leaderboard{
	{Username: "creed", Score: 2},
	{Username: "qwer", Score: 4},
	{Username: "qqaaz", Score: 6},
}

func getUsers(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, users)
}

func postUsers(c *gin.Context) {
	var newUser leaderboard

	if err := c.BindJSON(&newUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON payload"})
		return
	}

	users = append(users, newUser)
	c.JSON(http.StatusOK, gin.H{"message": "Added"})
}

func updateUserByUsername(username string,score int)(error) {
	for i,user := range users {
		if user.Username == username{
			users[i].Score = score
			return nil
		}
	}
	return errors.New("user not found")
}

func updateUser(c *gin.Context) {
	var updateUserReq leaderboard
	if err := c.BindJSON(&updateUserReq); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON payload"})
        return
    }

    err := updateUserByUsername(updateUserReq.Username, updateUserReq.Score)
	if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
        return
    }
	c.JSON(http.StatusOK, gin.H{"message": "Updated"})
}

func main() {
	router := gin.Default()
	router.GET("/leaderboard", getUsers)
	router.POST("/leaderboard", postUsers)
	router.PATCH("/leaderboard", updateUser)
	router.Run("localhost:8000")
}
