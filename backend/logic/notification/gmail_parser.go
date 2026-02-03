package notification

import (
    "encoding/xml"
    "io"
)

type atomFeed struct {
    Entries []struct {
        ID      string `xml:"id"`
        Title   string `xml:"title"`
        Summary string `xml:"summary"`
        Author  struct {
            Email string `xml:"email"`
        } `xml:"author"`
    } `xml:"entry"`
}

func ParseAndFilterGoogleEmails(xmlData io.Reader) ([]Email, error) {
    var feed atomFeed
    body, _ := io.ReadAll(xmlData)
    if err := xml.Unmarshal(body, &feed); err != nil {
        return []Email{}, err
    }

    var filtered []Email
    for _, e := range feed.Entries {
        // TEMPORARILY ACCEPT ALL EMAILS - no filter
        filtered = append(filtered, Email{
            ID:      e.ID,
            Title:   e.Title,
            Summary: e.Summary,
            From:    e.Author.Email,
        })
    }
    return filtered, nil
}
