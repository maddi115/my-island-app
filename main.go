package main

import (
"context"
"embed"
"syscall"
"time"

"github.com/lxn/win"
"github.com/wailsapp/wails/v2"
"github.com/wailsapp/wails/v2/pkg/options"
"github.com/wailsapp/wails/v2/pkg/options/assetserver"
"github.com/wailsapp/wails/v2/pkg/options/windows"
"github.com/wailsapp/wails/v2/pkg/runtime"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
app := NewApp()

err := wails.Run(&options.App{
Title:  "my-island-app", // MUST MATCH THE FINDWINDOW CALL
Width:  324,
Height: 768,
AssetServer: &assetserver.Options{
Assets: assets,
},
AlwaysOnTop:      true,
Frameless:        true,
BackgroundColour: &options.RGBA{R: 0, G: 0, B: 0, A: 0},
OnStartup: func(ctx context.Context) {
app.startup(ctx)
runtime.WindowSetPosition(ctx, 889, 44)
runtime.WindowSetSize(ctx, 104, 40)

go func() {
time.Sleep(500 * time.Millisecond)
// Searching for the title we set above
hwnd := win.FindWindow(nil, syscall.StringToUTF16Ptr("my-island-app"))
if hwnd != 0 {
exStyle := win.GetWindowLong(hwnd, win.GWL_EXSTYLE)
win.SetWindowLong(hwnd, win.GWL_EXSTYLE, exStyle|win.WS_EX_LAYERED)
}
}()
},
Bind: []interface{}{
app,
},
Windows: &windows.Options{
WebviewIsTransparent:              true,
DisableFramelessWindowDecorations: true,
},
})

if err != nil {
println("Error:", err.Error())
}
}
