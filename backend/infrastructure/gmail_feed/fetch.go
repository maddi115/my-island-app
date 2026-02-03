package gmail_feed

import (
    "fmt"
    "io"
    "net/http"
)

const atomFeedURL = "https://mail.google.com/mail/feed/atom"

// FetchAtomFeed retrieves Gmail Atom feed using Basic Auth
func FetchAtomFeed() (string, error) {
    creds, err := LoadCredentials()
    if err != nil {
        return "", fmt.Errorf("failed to load credentials: %w", err)
    }

    req, err := http.NewRequest("GET", atomFeedURL, nil)
    if err != nil {
        return "", fmt.Errorf("failed to create request: %w", err)
    }

    // Set Basic Auth
    req.SetBasicAuth(creds.Username, creds.AppPassword)

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        return "", fmt.Errorf("failed to fetch atom feed: %w", err)
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK {
        return "", fmt.Errorf("unexpected status code: %d", resp.StatusCode)
    }

    body, err := io.ReadAll(resp.Body)
    if err != nil {
        return "", fmt.Errorf("failed to read response body: %w", err)
    }

    return string(body), nil
}
