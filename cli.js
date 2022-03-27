const playlist = require('./src/playlist')


const args = process.argv
const url = args[2]
const options = args[3]

if(!url){
    console.log('Please, inform the url')
    process.exit(1)
}

const arrayOptions = ['--help', '--playlist', '--video', '--audio', '--subtitle']

async function verifyOptions (argument) {
    if(!arrayOptions.includes(argument) ||  options === '--help'){
        console.log(`
        --help: Show this help
        --playlist: Download playlist
        --video: Download video
        --audio: Download audio
        --subtitle: Download subtitle
        `)
        return
    }
    if(options === '--playlist'){
        await playlist(url)
        return
    }
}

verifyOptions(options)



