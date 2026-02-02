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

// Apply Win32 layered window transparency fix (removes black/gray background box)
// This makes the entire window background see-through so only the pill is visible
go func() {
// Delay to ensure the native window is fully created by Wails/WebView2
time.Sleep(800 * time.Millisecond)

// Find the window handle using the exact title set in main.go
hwnd := win.FindWindow(nil, syscall.StringToUTF16Ptr("my-island-app"))
if hwnd != 0 {
// Get current extended window style
exStyle := win.GetWindowLong(hwnd, win.GWL_EXSTYLE)
// Add WS_EX_LAYERED flag → enables per-pixel alpha transparency
win.SetWindowLong(hwnd, win.GWL_EXSTYLE, exStyle|win.WS_EX_LAYERED)
}
}()
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
return fmt.Sprintf("Hello %s, It's show time!", name)
}
