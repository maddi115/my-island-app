package app

import (
    "github.com/maddi115/my-island-app/backend/domain"
    "github.com/maddi115/my-island-app/backend/usecase"
)

// App struct exposes methods to Wails frontend
type App struct{}

// NewApp creates a new App instance
func NewApp() *App {
    return &App{}
}

// GetGoogleEmails is exposed to frontend via Wails
func (a *App) GetGoogleEmails() []domain.Email {
    emails, err := usecase.GetGoogleEmails()
    if err != nil {
        // Return empty slice on error
        // TODO: Add proper error handling/logging
        return []domain.Email{}
    }
    return emails
}
