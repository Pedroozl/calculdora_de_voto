package discord

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
)

var client = &http.Client{}

func LenDmMessages(id string, token string, authorid string) float64 {
	req, err := http.NewRequest(http.MethodGet, "https://discord.com/api/v9/channels/"+id+"/messages/search?author_id="+authorid, nil)
	if err != nil {
		println(err)
	}
	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("Authorization", token)

	resp, err := client.Do(req)
	if err != nil {
		println(err)
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		println(err)
	}

	defer resp.Body.Close()
	var bodyjson map[string]interface{}
	json.Unmarshal(body, &bodyjson)
	return bodyjson["total_results"].(float64)
}

func GetChannels(id string, token string, authorid string) float64 {
	req, err := http.NewRequest(http.MethodGet, "https://discord.com/api/v9/channels/"+id+"/messages/search?author_id="+authorid, nil)
	if err != nil {
		println(err)
	}
	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("Authorization", token)

	resp, err := client.Do(req)
	if err != nil {
		println(err)
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		println(err)
	}

	defer resp.Body.Close()
	var bodyjson map[string]interface{}
	json.Unmarshal(body, &bodyjson)
	return bodyjson["total_results"].(float64)
}
