package main

import (
    "context"
    "syscall"
    "time"
    "github.com/lxn/win"
    "github.com/maddi115/my-island-app/backend/logic/notification"
)

type App struct {
    ctx         context.Context
    Coordinator *notification.Coordinator
}

func NewApp() *App {
    return &App{
        Coordinator: notification.NewCoordinator(),
    }
}

func (a *App) startup(ctx context.Context) {
    a.ctx = ctx
    
    // Transparency fix
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

// GetGoogleEmails - Gateway for frontend (Wails binds this)
func (a *App) GetGoogleEmails() []notification.Email {
    signals, err := a.Coordinator.CheckForNewSignal()
    if err != nil {
        return []notification.Email{}
    }
    return signals
}
