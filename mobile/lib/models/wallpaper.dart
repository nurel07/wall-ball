class Wallpaper {
  final String id;
  final String url;
  final String? name;
  final String? description;
  final String? artist;
  final String? creationDate;

  Wallpaper({
    required this.id,
    required this.url,
    this.name,
    this.description,
    this.artist,
    this.creationDate,
  });

  factory Wallpaper.fromJson(Map<String, dynamic> json) {
    return Wallpaper(
      id: json['id'],
      url: json['url'],
      name: json['name'],
      description: json['description'],
      artist: json['artist'],
      creationDate: json['creationDate'],
    );
  }
}
