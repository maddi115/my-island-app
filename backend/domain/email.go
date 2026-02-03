package domain

// Email represents a single email notification
type Email struct {
    Title   string `json:"title"`
    Summary string `json:"summary"`
    From    string `json:"from"`
}
