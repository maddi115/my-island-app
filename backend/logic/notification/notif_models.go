package notification

type Email struct {
    ID      string `json:"id"`
    Title   string `json:"title"`
    Summary string `json:"summary"`
    From    string `json:"from"`
}

type Credentials struct {
    Username    string `json:"username"`
    AppPassword string `json:"app_password"`
}
