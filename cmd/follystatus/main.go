package main

import (
	"net/http"
	"os"
	"strconv"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	llmclient "github.com/kapilpokhre/follystatus/internal/llmclinet"
	log "github.com/sirupsen/logrus"
)

func setupRouter(client *llmclient.LLMClient) *gin.Engine {
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowAllOrigins: true,
	}))
	r.GET("/funstatus/:code", func(c *gin.Context) {
		code, err := strconv.Atoi(c.Params.ByName("code"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": "code is not integer"})
			return
		}
		resp, err := client.GetStatusMessages(llmclient.HTTPStatusRequest{
			Code:             code,
			AdditionalPrompt: c.DefaultQuery("prompt", ""),
		})
		if err != nil {
			log.Error(err)
		}
		c.JSON(http.StatusOK, gin.H{"status_messages": resp.Messages})
	})
	return r
}

func main() {
	key, ok := os.LookupEnv("GROQ_API_KEY")
	if !ok {
		panic("GROQ_API_KEY environemnt variable expected.")
	}
	client := llmclient.NewLLMClient(key)
	r := setupRouter(client)
	r.Run(":8080")
}
