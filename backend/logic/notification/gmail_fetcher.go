package notification

import (
    "encoding/json"
    "net/http"
    "os"
)

func LoadSecretCredentials() (*Credentials, error) {
    body, err := os.ReadFile("backend/config/credentials.json")
    if err != nil {
        return nil, err
    }
    var creds Credentials
    err = json.Unmarshal(body, &creds)
    return &creds, err
}

func FetchRawGmailFeed(creds *Credentials) (*http.Response, error) {
    client := &http.Client{}
    req, _ := http.NewRequest("GET", "https://mail.google.com/mail/feed/atom", nil)
    req.SetBasicAuth(creds.Username, creds.AppPassword)
    return client.Do(req)
}
