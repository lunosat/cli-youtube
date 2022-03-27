const usetube = require('usetube');
const axios = require('axios')
const fs = require('fs')
const path = require('path')
const chalkAnimation = require('chalk-animation');

async function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms))
}
async function generateUrl(id){
    const url = `https://www.youtube.com/watch?v=${id}`
    return url
}
async function generateAllUrlFromPlaylist(playlist){
    let arrayUrl = []
    for(let i = 0; i < playlist.length; i++){
        const url = await generateUrl(playlist[i].id)
        arrayUrl.push(url)
    }
    return arrayUrl
}
async function downloadAndSave(url){
    try {
        axios
            .get(`http://207.244.233.10:3000/audio?url=${url}&apiKey=todo`)
                .then((response) => {
                    axios
                        .get(`http://${response.data.download}`, { responseType: 'arraybuffer'})
                            .then((responseBuffer) => {
                                //save buffer to file
                                const fileName = `${response.data.title}.mp3`
                                const filePath = path.join(__dirname, '../', 'download', fileName)
                                fs.writeFile(filePath, responseBuffer.data, (err) => {
                                    if(err){
                                        console.log(err)
                                    }
                                }       
                            )   
                        }
                    )
                            
        })
    } catch (err) {
        console.log('Erro no download de ' + url)
    }
}
async function playlist(url){
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/playlist\?list=(.*)$/
    const playlistId = url.match(regex)[4]
    try{
        const playlistInfo = await usetube.getPlaylistVideos(playlistId)
        const formatedUrl = await generateAllUrlFromPlaylist(playlistInfo)
        chalkAnimation.glitch(`Initializing download of ${playlistInfo.length} audios`)
        for(let i = 0; i < formatedUrl.length; i++){
           await downloadAndSave(formatedUrl[i])
           chalkAnimation.rainbow(`Downloading file ${i + 1} of ${formatedUrl.length} from: ${formatedUrl[i]}`);
           await sleep(5000)
        }
        chalkAnimation.radar(`Download finished`)
        process.exit(0)


    }catch(err){
        console.log(err)
       
    }
}

module.exports = playlist