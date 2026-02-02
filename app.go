package main

import (
"context"
"fmt"
"syscall"
"time"

"github.com/lxn/win"
)

// App struct
type App struct {
ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
a.ctx = ctx

// Reliable transparency fix: poll for window handle until found
go func() {
// Try every 100ms, max 50 attempts (~5 seconds)
for i := 0; i < 50; i++ {
hwnd := win.FindWindow(nil, syscall.StringToUTF16Ptr("my-island-app"))
if hwnd != 0 {
// Got the handle → apply layered style for transparency
exStyle := win.GetWindowLong(hwnd, win.GWL_EXSTYLE)
win.SetWindowLong(hwnd, win.GWL_EXSTYLE, exStyle|win.WS_EX_LAYERED)
break
}
time.Sleep(100 * time.Millisecond)
}
}()
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
return fmt.Sprintf("Hello %s, It's show time!", name)
}
