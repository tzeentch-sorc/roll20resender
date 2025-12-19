package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

// структура сообщения от Node.js
type DiscordRequest struct {
	WebhookURL string                 `json:"DISCORD_WEBHOOK_URL"`
	Data       map[string]interface{} `json:"data"`
	Headers    map[string]string      `json:"headers"`
}

func main() {
	wsURL := "ws://127.0.0.1:8081/ws"
	conn, _, err := websocket.DefaultDialer.Dial(wsURL, nil)
	if err != nil {
		log.Fatalf("Ошибка подключения к WebSocket: %v", err)
	}
	defer conn.Close()

	fmt.Println("discord-webhook-handler.exe подключен к WebSocket")

	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			log.Println("Ошибка чтения WebSocket:", err)
			return
		}

		var req DiscordRequest
		if err := json.Unmarshal(message, &req); err != nil {
			log.Println("Некорректный JSON:", err)
			continue
		}

		// сериализуем Data в JSON
		jsonBody, err := json.Marshal(req.Data)
		if err != nil {
			log.Println("Ошибка сериализации JSON:", err)
			continue
		}

		// создаём POST-запрос
		httpReq, err := http.NewRequest("POST", req.WebhookURL, bytes.NewBuffer(jsonBody))
		if err != nil {
			log.Println("Ошибка создания HTTP запроса:", err)
			continue
		}

		// добавляем заголовки
		for key, val := range req.Headers {
			httpReq.Header.Set(key, val)
		}

		resp, err := http.DefaultClient.Do(httpReq)
		if err != nil {
			log.Println("Ошибка отправки вебхука:", err)
			continue
		}
		resp.Body.Close()

		fmt.Println("Webhook успешно отправлен")
	}
}
