package main

import (
    "context"
    "syscall"
    "time"
    "github.com/lxn/win"
    "github.com/maddi115/my-island-app/backend/notifications/email"
)

type App struct {
    ctx         context.Context
    Coordinator *email.Coordinator
}

func NewApp() *App {
    return &App{
        Coordinator: email.NewCoordinator(),
    }
}

func (a *App) startup(ctx context.Context) {
    a.ctx = ctx
    
    go func() {
        for i := 0; i < 50; i++ {
            hwnd := win.FindWindow(nil, syscall.StringToUTF16Ptr("my-island-app"))
            if hwnd != 0 {
                exStyle := win.GetWindowLong(hwnd, win.GWL_EXSTYLE)
                win.SetWindowLong(hwnd, win.GWL_EXSTYLE, exStyle|win.WS_EX_LAYERED)
                break
            }
            time.Sleep(100 * time.Millisecond)
        }
    }()
}

// GetGoogleEmails - Gateway for frontend
func (a *App) GetGoogleEmails() []email.Email {
    signals, err := a.Coordinator.CheckForNewSignal()
    if err != nil {
        return []email.Email{}
    }
    return signals
}
