package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"sort"
	"strconv"
	"sync"
	"time"
	// "errors"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/redis/go-redis/v9"
)

var (
	upgrader      = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
	clients       = make(map[*websocket.Conn]bool)
	clientLock    sync.Mutex
	leaderboardCh = make(chan struct{})
)

var client *redis.Client
var ctx context.Context

type leaderboard struct {
	Username string `json:"username"`
	Score    int    `json:"score"`
}

type newUserRequest struct {
	Username string `json:"username"`
}

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

func notifyLeaderboardChange() {
	message := []byte("Leaderboard updated")

	clientLock.Lock()
	defer clientLock.Unlock()

	for conn := range clients {
		err := conn.WriteMessage(websocket.TextMessage, message)
		if err != nil {
			fmt.Println("Error sending leaderboard change notification to client:", err)
		} else {
			fmt.Println("Notification sent to client")
		}
	}
}


func wsHandler(c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		fmt.Println("Error upgrading to WebSocket:", err)
		return
	}

	clientLock.Lock()
	clients[conn] = true
	clientLock.Unlock()

	for range leaderboardCh {
		notifyLeaderboardChange()
	}
	conn.Close()
}


func seed() {

	client = redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "",
		DB:       0,
	})
	defer client.Close()

	ctx = context.Background()
	currentLeaderboard := client.HGetAll(ctx, "leaderboard").Val()

	if len(currentLeaderboard) == 0 {

		users := []leaderboard{
			{"Creed", 8},
			{"Binod", 9},
			{"Caitlyn", 7},
			{"David", 2},
		}
		for _, user := range users {
			err := client.HSet(ctx, "leaderboard", user.Username, user.Score).Err()
			if err != nil {
				fmt.Println("Error during seeding:", err)
				return
			}
		}
	}
}


func getLeaderboard(c *gin.Context) {

	client = redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "",
		DB:       0,
	})
	defer client.Close()

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
	sort.Slice(users, func(i, j int) bool {
		return users[i].Score > users[j].Score
	})
	c.IndentedJSON(http.StatusOK, users)
}

func postLeaderboard(c *gin.Context) {

	client = redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "",
		DB:       0,
	})
	defer client.Close()

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
		} else{
			fmt.Println("Score incremented for", username)
			c.JSON(http.StatusOK, gin.H{"message": "User added"})
		}
	} else {
		err := client.HSet(ctx, "leaderboard", username, 1).Err()
		if err != nil {
			fmt.Println("Error setting score:", err)
			return
		} else{
			fmt.Println("Username", username, "added with score 1")
			c.JSON(http.StatusOK, gin.H{"message": "Score got incremented"})
		}
	}
	defer func() {
        time.Sleep(500 * time.Millisecond)
        leaderboardCh <- struct{}{}
    }()
}



func postGame(c *gin.Context) {

	client = redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "",
		DB:       0,
	})
	defer client.Close()

	var newState state


	err := c.BindJSON(&newState)
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
	client = redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "",
		DB:       0,
	})
	defer client.Close()

	ctx = context.Background()
	username := c.Query("username")
	currentState, err := client.HGetAll(ctx, "user_state:"+username).Result()
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

	c.IndentedJSON(http.StatusOK, currentStateJson)
}

func initialize() {
	
	router := gin.Default()
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	router.Use(cors.New(config))
	router.GET("/ws", func(c *gin.Context) {
		fmt.Println("New connection")
		wsHandler(c)
	})
	router.GET("/leaderboard", getLeaderboard)
	router.POST("/leaderboard", postLeaderboard)
	router.POST("/game", postGame)
	router.GET("/game", getGame)
	router.Run("localhost:8000")
}

func main() {
	seed()
	initialize()
}
