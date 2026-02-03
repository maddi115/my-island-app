package gmail_feed

import (
    "encoding/xml"
    "github.com/maddi115/my-island-app/backend/domain"
)

// AtomFeed represents the Gmail Atom feed structure
type AtomFeed struct {
    XMLName xml.Name    `xml:"feed"`
    Entries []AtomEntry `xml:"entry"`
}

type AtomEntry struct {
    Title   string     `xml:"title"`
    Summary string     `xml:"summary"`
    Author  AtomAuthor `xml:"author"`
}

type AtomAuthor struct {
    Name  string `xml:"name"`
    Email string `xml:"email"`
}

// ParseAtomXML parses XML and returns ALL emails (FILTER REMOVED FOR TESTING)
func ParseAtomXML(xmlData string) ([]domain.Email, error) {
    var feed AtomFeed
    if err := xml.Unmarshal([]byte(xmlData), &feed); err != nil {
        return nil, err
    }

    var emails []domain.Email
    for _, entry := range feed.Entries {
        // TESTING: Accept ALL emails (no google.com filter)
        emails = append(emails, domain.Email{
            Title:   entry.Title,
            Summary: entry.Summary,
            From:    entry.Author.Email,
        })
    }

    return emails, nil
}
