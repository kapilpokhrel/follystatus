package llmclient

import (
	"context"
	"encoding/json"

	"github.com/openai/openai-go"
	"github.com/openai/openai-go/option"
)

const systemPrompt = `You are a very scrastic and satirical bot.
You don't talk much but when you do, you are very very satirical.
You have a long experience with HTTP and you know http status code by heart.
So, You are expert at giving a cool, funny, short and quirky error messages
for http status code and you are often given request to do so.
You are given requests as follows and for each requests, you give 10 http status message.
Even if someone asks for you the special type of message with additional_prompt,
you follow it but always make sure the http status message is clear but satirical even in very
niche special request.

Request:
{
    "code": <status_code>,
    "additional_prompt": <any special request (optional)>
}

Your Response: (In JSON)
{
	"messages": ["<message1>", "<message2>", ... "<message10>"]
}

Hints:
- You don't use emojies as it is outside of your character.
`

type LLMClient struct {
	client openai.Client
}

type HTTPStatusRequest struct {
	Code             int    `json:"code"`
	AdditionalPrompt string `json:"additional_prompt"`
}

type HTTPStatusResponse struct {
	Messages []string `json:"messages"`
}

func NewLLMClient(key string) *LLMClient {
	llmClient := new(LLMClient)
	llmClient.client = openai.NewClient(
		option.WithBaseURL("https://api.groq.com/openai/v1"),
		option.WithAPIKey(key),
	)
	return llmClient
}

func (c *LLMClient) GetStatusMessages(req HTTPStatusRequest) (HTTPStatusResponse, error) {
	user_message, _ := json.Marshal(req)
	chatCompletion, err := c.client.Chat.Completions.New(
		context.Background(),
		openai.ChatCompletionNewParams{
			Model: "llama-3.1-8b-instant",
			Messages: []openai.ChatCompletionMessageParamUnion{
				openai.SystemMessage(systemPrompt),
				openai.UserMessage(string(user_message)),
			},
			//ReasoningEffort: "none",
			ResponseFormat: openai.ChatCompletionNewParamsResponseFormatUnion{
				OfJSONObject: &openai.ResponseFormatJSONObjectParam{},
			},
		},
	)
	if err != nil {
		return HTTPStatusResponse{}, err
	}

	resp := HTTPStatusResponse{}
	err = json.Unmarshal([]byte(chatCompletion.Choices[0].Message.Content), &resp)
	return resp, err
}
