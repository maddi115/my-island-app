package notification

import (
    "fmt"
)

// Coordinator manages state and prevents duplicate notifications
type Coordinator struct {
    LastSeenID string
}

func NewCoordinator() *Coordinator {
    return &Coordinator{}
}

// CheckForNewSignal - THE FIX for "sometimes works"
func (c *Coordinator) CheckForNewSignal() ([]Email, error) {
    creds, err := LoadSecretCredentials()
    if err != nil {
        fmt.Printf("❌ Coordinator: auth failed - %v\n", err)
        return []Email{}, fmt.Errorf("coordinator: auth failed - %v", err)
    }

    resp, err := FetchRawGmailFeed(creds)
    if err != nil {
        fmt.Printf("❌ Coordinator: fetch failed - %v\n", err)
        return []Email{}, fmt.Errorf("coordinator: fetch failed - %v", err)
    }
    defer resp.Body.Close()

    if resp.StatusCode != 200 {
        fmt.Printf("❌ Coordinator: access denied (status %d)\n", resp.StatusCode)
        return []Email{}, fmt.Errorf("coordinator: access denied (status %d)", resp.StatusCode)
    }

    activeSignals, err := ParseAndFilterGoogleEmails(resp.Body)
    if err != nil {
        fmt.Printf("❌ Coordinator: parse failed - %v\n", err)
        return []Email{}, fmt.Errorf("coordinator: parse failed - %v", err)
    }

    // No emails? Return EMPTY ARRAY not nil
    if len(activeSignals) == 0 {
        fmt.Println("📭 No Google emails found")
        return []Email{}, nil
    }

    // CRITICAL: Check if this email was already seen
    if activeSignals[0].ID == c.LastSeenID {
        fmt.Println("✅ Already seen this email")
        return []Email{}, nil // Return EMPTY ARRAY not nil
    }

    // Update state - remember this email
    c.LastSeenID = activeSignals[0].ID
    
    fmt.Printf("✉️ Found %d new email(s)\n", len(activeSignals))
    return activeSignals, nil
}
