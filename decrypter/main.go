package main

import (
	cryptograph "decrypter/crypto"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"

	"fyne.io/systray/example/icon"
	"github.com/getlantern/systray"
)

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}

func main() {
	http.HandleFunc("/rpc/gettokens", func(w http.ResponseWriter, r *http.Request) {
		cryptograph.GetTokens()
		enableCors(&w)
		arr, _ := json.Marshal(cryptograph.GetTokens())
		io.WriteString(w, string(arr))
	})
	systray.Run(onReady, onExit)
}

func onReady() {
	systray.SetIcon(icon.Data)
	systray.SetTitle("Awesome App")
	systray.SetTooltip("Pretty awesome超级棒")
	mQuit := systray.AddMenuItem("Quit", "Quit the whole app")

	cryptograph.FindTokens()
	go http.ListenAndServe("127.0.0.1:14515", nil)

	// Sets the icon of a menu item. Only available on Mac and Windows.
	mQuit.SetIcon(icon.Data)
	for {
		select {
		case <-mQuit.ClickedCh:
			systray.Quit()
			fmt.Println("Quit2 now...")
			return
		}
	}
}

func onExit() {
	os.Exit(0)
}
