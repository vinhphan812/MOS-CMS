const axios = require("axios");


const HOST = "https://youtube.com";

const defaultBody = {
    "context": {
        "client": {
            "hl": "vi",
            "gl": "VN",
            "clientName": "WEB",
            "clientVersion": "2.20230201.01.00",
            "osName": "Windows",
            "osVersion": "10.0",
            "platform": "DESKTOP",
            "timeZone": "Asia/Saigon",
            "browserName": "Chrome",
            "browserVersion": "109.0.0.0",
            "acceptHeader": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9"
        }
    }, "browseId": "UCwEteJ0EpkOHgcKoqLCmGPQ", "params": "EglwbGF5bGlzdHPyBgQKAkIA"
}

class YTB {
    REGEXS = {
        INNERTUBE_API_KEY: /(?<=innertubeApiKey":")(.*?)(?=")/g
    }

    constructor(props) {
    }


    getAPIKEY() {
        return new Promise(async (resolve, reject) => {
            try {
                const { data } = await axios(HOST);

                const [matcher] = data.match(this.REGEXS.INNERTUBE_API_KEY);

                console.log(matcher);

            } catch (e) {

            }
        })
    }

    getPlayList() {
        return new Promise(async (resolve, reject) => {
            try {
                const { data: { contents: { twoColumnBrowseResultsRenderer: { tabs: [home, video, playlistTab] } } } } = await axios({
                    url: "https://www.youtube.com/youtubei/v1/browse", method: "POST", data: defaultBody
                });

                if (!playlistTab) throw new Error("GET PLAYLIST FAIL");

                let items = playlistTab.tabRenderer.content.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].shelfRenderer.content.horizontalListRenderer.items;

                items = items.map(({ gridPlaylistRenderer: { title, thumbnail, publishedTimeText, videoCountShortText } }) => {
                    return {
                        title: title.runs[0].text,
                        thumbnail: thumbnail.thumbnails[0].url,
                        url: title.runs[0].navigationEndpoint.commandMetadata.webCommandMetadata.url,
                        publishedTimeText: publishedTimeText?.simpleText,
                        videoCountShortText: +videoCountShortText?.simpleText
                    }
                })

                resolve(items);
            } catch (e) {
                reject(e);
            }
        })
    }
}

module.exports = YTB;