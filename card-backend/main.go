package main

import (
	// "errors"
	"context"
	"encoding/json"
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
	fmt.Printf("%T \n %v", users, users)
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

func postLeaderboard(c *gin.Context) {
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

// const initState = {
//     cnt: 4,
//     won: false,
//     defuse: 0,
//     start:false,
//     shuffle:false,
//     cards:randomCards(),
//     msg:'Press start to begin',
//     username:null
// }

type state struct {
	Username string   `json:"username"`
	Cnt      int      `json:"cnt"`
	Won      bool     `json:"won"`
	Defuse   int      `json:"defuse"`
	Start    bool     `json:"start"`
	Shuffle  bool     `json:"shuffle"`
	Cards    []string `json:"cards"`
	Msg      string   `json:"msg"`
}

func postGame(c *gin.Context) {
	var newState state

	fmt.Print(newState)

	err := c.BindJSON(&newState); 
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON payload"})
		return
	}

	ctx = context.Background()

	redisKey := "user_state:" + newState.Username

	err = client.HSet(ctx, redisKey, "username", newState.Username).Err()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to store username"})
		return
	}

	err = client.HSet(ctx, redisKey, "cnt", strconv.Itoa(newState.Cnt)).Err()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to store cnt"})
		return
	}

	err = client.HSet(ctx, redisKey, "won", strconv.FormatBool(newState.Won)).Err()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to store won"})
		return
	}

	err = client.HSet(ctx, redisKey, "defuse", strconv.Itoa(newState.Defuse)).Err()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to store defuse"})
		return
	}

	err = client.HSet(ctx, redisKey, "start", strconv.FormatBool(newState.Start)).Err()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to store start"})
		return
	}

	err = client.HSet(ctx, redisKey, "shuffle", strconv.FormatBool(newState.Shuffle)).Err()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to store shuffle"})
		return
	}

	cardsJSON, err := json.Marshal(newState.Cards)
	if err != nil {
		fmt.Println("Error marshalling cards to JSON:", err)
		return
	}

	err = client.HSet(ctx, redisKey, "cards", cardsJSON).Err()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to store cards"})
		return
	}

	err = client.HSet(ctx, redisKey, "msg", newState.Msg).Err()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to store msg"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Game state has been stored"})
}

func getGame(c *gin.Context) {
	ctx = context.Background()
	username := c.Query("username")
	currentState, err := client.HGetAll(ctx, "user_state:"+username).Result()
	fmt.Print(err)
	if err != nil || len(currentState) == 0 {
		c.JSON(http.StatusNoContent, gin.H{"error": "Failed to retrieve game state of user"})
		return
	}

	currentStateJson := state{
		Username: currentState["username"],
	}

	cnt, _ := strconv.Atoi(currentState["cnt"])
	currentStateJson.Cnt = cnt

	won, _ := strconv.ParseBool(currentState["won"])
	currentStateJson.Won = won

	defuse, _ := strconv.Atoi(currentState["defuse"])
	currentStateJson.Defuse = defuse

	start, _ := strconv.ParseBool(currentState["start"])
	currentStateJson.Start = start

	shuffle, _ := strconv.ParseBool(currentState["shuffle"])
	currentStateJson.Shuffle = shuffle

	var cards []string
	json.Unmarshal([]byte(currentState["cards"]), &cards)
	currentStateJson.Cards = cards

	currentStateJson.Msg = currentState["msg"]

	fmt.Print(currentStateJson)
	c.IndentedJSON(http.StatusOK, currentStateJson)
}

func main() {
	client = redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "",
		DB:       0,
	})
	defer client.Close()
	fmt.Printf("%v", client)

	router := gin.Default()
	router.GET("/leaderboard", getLeaderboard)
	router.POST("/leaderboard", postLeaderboard)
	router.POST("/game", postGame)
	router.GET("/game", getGame)
	router.Run("localhost:8000")
}
