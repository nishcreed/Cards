package main

import (
	// "errors"
	"context"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

type leaderboard struct {
	Username string `json:"username"`
	Score    int    `json:"score"`
}

type newUserRequest struct {
	Username string `json:"username"`
}

// var users = []leaderboard{
// 	{Username: "creed", Score: 2},
// 	{Username: "qwer", Score: 4},
// 	{Username: "qqaaz", Score: 6},
// }

var client *redis.Client
var ctx context.Context


// func db() {
	
// 	err := client.Set(ctx, "foo", "bar", 0).Err()
// 	if err != nil {
// 		panic(err)
// 	}

// 	val, err := client.Get(ctx, "foo").Result()
// 	if err != nil {
// 		panic(err)
// 	}
// 	fmt.Println("foo", val)
// }

func getLeaderboard(c *gin.Context) {
	ctx = context.Background()
	currentLeaderboard := client.HGetAll(ctx, "leaderboard").Val()
	
	var users []leaderboard
	for username, scoreStr := range currentLeaderboard {
		score, err := strconv.Atoi(scoreStr)
		if err != nil {
			fmt.Println("Error in converting score from str to int:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error"})
			return
		}
		users = append(users, leaderboard{
			Username: username,
			Score:    score,
		})
	}
	fmt.Printf("%T \n %v",users,users)
	c.IndentedJSON(http.StatusOK, users)
}

// func postUsers(c *gin.Context) {
// 	var newUserReq newUserRequest

// 	if err := c.BindJSON(&newUserReq); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON payload"})
// 		return
// 	}

// 	// Check if the user already exists
// 	for i, user := range users {
// 		if user.Username == newUserReq.Username {
// 			users[i].Score += 1
// 			c.JSON(http.StatusOK, gin.H{"message": "Score increased"})
// 			return
// 		}
// 	}

// 	users = append(users, leaderboard{Username: newUserReq.Username, Score: 1})
// 	c.JSON(http.StatusOK, gin.H{"message": "User added"})
// }

func postLeaderboard(c *gin.Context){
	var newUserReq newUserRequest

	if err := c.BindJSON(&newUserReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON payload"})
		return
	}
	username := newUserReq.Username

	ctx = context.Background()
	exists, err := client.HExists(ctx, "leaderboard", username).Result()
	if err != nil {
		fmt.Println("Error checking username existence:", err)
		return
	}

	if exists {
		_, err := client.HIncrBy(ctx, "leaderboard", username, 1).Result()
		if err != nil {
			fmt.Println("Error incrementing score:", err)
			return
		}
		fmt.Println("Score incremented for", username)
		c.JSON(http.StatusOK, gin.H{"message": "User added"})
	} else {
		err := client.HSet(ctx, "leaderboard", username, 1).Err()
		if err != nil {
			fmt.Println("Error setting score:", err)
			return
		}
		fmt.Println("Username", username, "added with score 1")
		c.JSON(http.StatusOK, gin.H{"message": "Score got incremented"})
	}
}

// func updateUserByUsername(username string, score int) error {
// 	for i, user := range users {
// 		if user.Username == username {
// 			users[i].Score = score
// 			return nil
// 		}
// 	}
// 	return errors.New("user not found")
// }

// func updateUser(c *gin.Context) {
// 	var updateUserReq leaderboard
// 	if err := c.BindJSON(&updateUserReq); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON payload"})
// 		return
// 	}

// 	err := updateUserByUsername(updateUserReq.Username, updateUserReq.Score)
// 	if err != nil {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
// 		return
// 	}
// 	c.JSON(http.StatusOK, gin.H{"message": "Updated"})
// }

func main() {
	client = redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "", // no password set
		DB:       0,  // use default DB
	})
	defer client.Close()
	fmt.Printf("%v", client)
	
	// db()

	// router.PATCH("/leaderboard", updateUser)
	router := gin.Default()
	router.GET("/leaderboard", getLeaderboard)
	router.POST("/leaderboard", postLeaderboard)
	router.Run("localhost:8000")
}
