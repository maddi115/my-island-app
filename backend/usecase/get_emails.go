package usecase

import (
    "github.com/maddi115/my-island-app/backend/domain"
    "github.com/maddi115/my-island-app/backend/infrastructure/gmail_feed"
)

// GetGoogleEmails orchestrates fetching, parsing, and filtering emails
func GetGoogleEmails() ([]domain.Email, error) {
    // Fetch Atom feed
    xmlData, err := gmail_feed.FetchAtomFeed()
    if err != nil {
        return nil, err
    }

    // Parse and filter Google emails
    emails, err := gmail_feed.ParseAtomXML(xmlData)
    if err != nil {
        return nil, err
    }

    return emails, nil
}
