export default interface SpotifyPlaylist {
	id: string;
	name: string;
	images: SpotifyPlaylistImage[];
}

export interface SpotifyPlaylistImage {
	height: number;
	width: number;
	url: string;
}
