package gmail_feed

import (
    "encoding/json"
    "os"
)

type Credentials struct {
    Username    string `json:"username"`
    AppPassword string `json:"app_password"`
}

// LoadCredentials reads Gmail credentials from config file
func LoadCredentials() (*Credentials, error) {
    file, err := os.Open("backend/config/credentials.json")
    if err != nil {
        return nil, err
    }
    defer file.Close()

    var creds Credentials
    decoder := json.NewDecoder(file)
    if err := decoder.Decode(&creds); err != nil {
        return nil, err
    }

    return &creds, nil
}
