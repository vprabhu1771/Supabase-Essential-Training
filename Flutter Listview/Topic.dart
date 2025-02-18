class Topic {
  final int id;
  final String name;

  Topic({required this.id, required this.name});

  factory Topic.fromMap(Map<String, dynamic> map) {
    return Topic(
      id: map['id'],
      name: map['name'] as String,
    );
  }
}
