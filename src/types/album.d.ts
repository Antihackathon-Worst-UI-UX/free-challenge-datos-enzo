import Song from '@types/song'

interface Album {
  name: string
  image: string
  description: string
  songs: Song[]
}

export default Album
